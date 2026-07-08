import { useMemo, useRef, useState } from "react";
import { entryTypes } from "../data/mock";
import { Icon } from "../components/Icon";
import { SectionHeader } from "../components/SectionHeader";
import type { EntryType, FinanceKind } from "../types";

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: {
    transcript: string;
  };
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: (event: SpeechRecognitionEventLike) => void;
  onend: () => void;
  onerror: () => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionLike;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const defaults: Record<EntryType, Record<string, string>> = {
  task: { title: "", time: "", priority: "medium" },
  idea: { title: "", tag: "" },
  meeting: { title: "", time: "", description: "", place: "", reminder: "" },
  note: { title: "", description: "" },
  meal: { title: "", calories: "", protein: "", fat: "", carbs: "" },
  finance: { title: "", amount: "", kind: "expense", category: "", account: "Карта", note: "" },
  habit: { title: "", streak: "0", progress: "0" },
  goal: { title: "", progress: "0" }
};

function extractFirstNumber(text: string) {
  return text.match(/\d+([.,]\d+)?/)?.[0]?.replace(",", ".") ?? "";
}

function extractTime(text: string) {
  const time = text.match(/([01]?\d|2[0-3])[:. ]([0-5]\d)/);
  return time ? `${time[1].padStart(2, "0")}:${time[2]}` : "";
}

function cleanTitle(text: string) {
  return text
    .replace(/\b(расход|доход|потратил|потратила|купил|купила|получил|получила|запиши|добавь)\b/gi, "")
    .replace(/\d+([.,]\d+)?/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function inferFinanceKind(text: string): FinanceKind {
  return /(доход|получил|получила|зарплат|аванс|перевод пришел|кэшбек)/i.test(text) ? "income" : "expense";
}

function inferEntryType(text: string, currentType: EntryType): EntryType {
  if (/(расход|доход|потратил|потратила|купил|купила|руб|₽|деньг|зарплат|аванс|кэшбек)/i.test(text)) {
    return "finance";
  }

  if (/(встреч|созвон|звонок|событие|календар|напомни)/i.test(text)) {
    return "meeting";
  }

  if (/(съел|съела|калори|ккал|белк|жир|углевод|завтрак|обед|ужин)/i.test(text)) {
    return "meal";
  }

  if (/(привычк|каждый день|серия|трекать|отслеживать)/i.test(text)) {
    return "habit";
  }

  if (/(цель|хочу|достичь|план на месяц)/i.test(text)) {
    return "goal";
  }

  if (/(идея|придумал|придумала|инсайт)/i.test(text)) {
    return "idea";
  }

  if (/(заметка|запомни|мысль|наблюдение)/i.test(text)) {
    return "note";
  }

  if (/(задач|сделать|надо|нужно|срочно|важно)/i.test(text)) {
    return "task";
  }

  return currentType;
}

function inferCategory(text: string, kind: FinanceKind) {
  if (kind === "income") return "Доход";
  if (/(кофе|еда|продукт|завтрак|обед|ужин|ресторан|кафе)/i.test(text)) return "Еда";
  if (/(такси|метро|автобус|транспорт|бензин|парков)/i.test(text)) return "Транспорт";
  if (/(кино|игр|подписк|развлеч|бар|концерт)/i.test(text)) return "Развлечения";
  return "Разное";
}

function applyVoiceToPayload(type: EntryType, text: string, current: Record<string, string>) {
  const amount = extractFirstNumber(text);
  const title = cleanTitle(text) || text;

  if (type === "finance") {
    return {
      ...current,
      title,
      amount: amount || current.amount,
      kind: inferFinanceKind(text),
      category: current.category || inferCategory(text, inferFinanceKind(text)),
      note: text
    };
  }

  if (type === "meal") {
    return {
      ...current,
      title,
      calories: amount || current.calories
    };
  }

  if (type === "meeting") {
    return {
      ...current,
      title,
      time: extractTime(text) || current.time,
      description: text
    };
  }

  if (type === "note") {
    return {
      ...current,
      title: title.slice(0, 64),
      description: text
    };
  }

  if (type === "idea") {
    return {
      ...current,
      title,
      tag: current.tag || "voice"
    };
  }

  if (type === "goal") {
    return {
      ...current,
      title,
      progress: amount || current.progress
    };
  }

  if (type === "habit") {
    return {
      ...current,
      title,
      progress: amount || current.progress
    };
  }

  return {
    ...current,
    title,
    priority: /(срочно|важно|критично)/i.test(text) ? "high" : current.priority
  };
}

export function AddEntry({
  initialType,
  onAdd,
  onCancel
}: {
  initialType: EntryType;
  onAdd: (type: EntryType, payload: Record<string, string>) => void;
  onCancel: () => void;
}) {
  const [type, setType] = useState<EntryType>(initialType);
  const [payload, setPayload] = useState<Record<string, string>>(defaults[initialType]);
  const [voiceText, setVoiceText] = useState("");
  const [voiceStatus, setVoiceStatus] = useState("Готов к диктовке");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const speechSupported = Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  const fields = useMemo(() => {
    const fieldMap: Record<EntryType, Array<{ name: string; label: string; type?: string; placeholder: string }>> = {
      task: [
        { name: "title", label: "Название", placeholder: "Например: оплатить счет" },
        { name: "time", label: "Срок", placeholder: "18:00" },
        { name: "priority", label: "Приоритет", placeholder: "low / medium / high" }
      ],
      idea: [
        { name: "title", label: "Идея", placeholder: "Сформулируйте мысль" },
        { name: "tag", label: "Тег", placeholder: "product" }
      ],
      meeting: [
        { name: "title", label: "Название", placeholder: "Встреча с..." },
        { name: "time", label: "Время", type: "time", placeholder: "12:00" },
        { name: "description", label: "Описание", placeholder: "Повестка" },
        { name: "place", label: "Место", placeholder: "Telegram" },
        { name: "reminder", label: "Напоминание", placeholder: "за 10 минут" }
      ],
      note: [
        { name: "title", label: "Заголовок", placeholder: "Коротко о заметке" },
        { name: "description", label: "Текст", placeholder: "Что важно запомнить" }
      ],
      meal: [
        { name: "title", label: "Блюдо", placeholder: "Паста с курицей" },
        { name: "calories", label: "Калории", type: "number", placeholder: "520" },
        { name: "protein", label: "Белки", type: "number", placeholder: "34" },
        { name: "fat", label: "Жиры", type: "number", placeholder: "18" },
        { name: "carbs", label: "Углеводы", type: "number", placeholder: "62" }
      ],
      finance: [
        { name: "title", label: "Операция", placeholder: "Кофе, зарплата, такси" },
        { name: "amount", label: "Сумма", type: "number", placeholder: "420" },
        { name: "kind", label: "Тип", placeholder: "expense / income" },
        { name: "category", label: "Категория", placeholder: "Еда, транспорт, работа" },
        { name: "account", label: "Счет", placeholder: "Карта, наличные" },
        { name: "note", label: "Комментарий", placeholder: "Любая деталь" }
      ],
      habit: [
        { name: "title", label: "Привычка", placeholder: "Медитация" },
        { name: "streak", label: "Серия дней", type: "number", placeholder: "0" },
        { name: "progress", label: "Прогресс", type: "number", placeholder: "0" }
      ],
      goal: [
        { name: "title", label: "Цель", placeholder: "Что хотите улучшить" },
        { name: "progress", label: "Прогресс", type: "number", placeholder: "0" }
      ]
    };

    return fieldMap[type];
  }, [type]);

  function switchType(nextType: EntryType) {
    setType(nextType);
    setPayload(defaults[nextType]);
    setVoiceText("");
    setVoiceStatus("Готов к диктовке");
  }

  function applyVoiceText(text: string) {
    const nextType = inferEntryType(text, type);

    if (nextType !== type) {
      setType(nextType);
      setPayload(applyVoiceToPayload(nextType, text, defaults[nextType]));
      return;
    }

    setPayload((current) => applyVoiceToPayload(type, text, current));
  }

  function startVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceStatus("Голосовой ввод не поддерживается в этом WebView. Вставьте текст вручную.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "ru-RU";
    recognition.interimResults = true;
    recognition.continuous = false;
    setIsListening(true);
    setVoiceStatus("Слушаю...");

    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ")
        .trim();
      setVoiceText(text);
      applyVoiceText(text);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setVoiceStatus("Не получилось распознать речь. Можно ввести текст ниже.");
    };

    recognition.onend = () => {
      setIsListening(false);
      setVoiceStatus("Готово. Проверьте поля перед сохранением.");
    };

    recognition.start();
  }

  function stopVoiceInput() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  return (
    <section className="screen">
      <SectionHeader title="Новая запись" subtitle="быстрое добавление" />

      <div className="voice-card">
        <div>
          <p className="eyebrow">Голосовой ввод</p>
          <h2>{voiceStatus}</h2>
          <span>{speechSupported ? "Скажите фразу, я определю тип записи и заполню форму." : "Если кнопка недоступна, вставьте текст вручную."}</span>
        </div>
        <button className={`voice-button ${isListening ? "listening" : ""}`} type="button" onClick={isListening ? stopVoiceInput : startVoiceInput}>
          <Icon name={isListening ? "micOff" : "mic"} size={21} />
          <span>{isListening ? "Стоп" : "Голосом"}</span>
        </button>
        <label className="voice-textarea">
          <span>Распознанный текст</span>
          <textarea
            value={voiceText}
            placeholder="Например: расход кофе 420 еда карта"
            onChange={(event) => {
              setVoiceText(event.target.value);
              applyVoiceText(event.target.value);
            }}
          />
        </label>
      </div>

      <div className="type-grid">
        {entryTypes.map((entry) => (
          <button
            className={`type-card ${type === entry.id ? "selected" : ""}`}
            key={entry.id}
            onClick={() => switchType(entry.id)}
            type="button"
          >
            <Icon name={entry.id} />
            <strong>{entry.title}</strong>
            <span>{entry.caption}</span>
          </button>
        ))}
      </div>

      <form
        className="form-card"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd(type, payload);
        }}
      >
        {fields.map((field) => (
          <label className="field" key={field.name}>
            <span>{field.label}</span>
            <input
              type={field.type || "text"}
              value={payload[field.name] || ""}
              placeholder={field.placeholder}
              onChange={(event) => setPayload((current) => ({ ...current, [field.name]: event.target.value }))}
            />
          </label>
        ))}

        <div className="form-actions">
          <button className="ghost-button" type="button" onClick={onCancel}>
            Отмена
          </button>
          <button className="primary-button" type="submit">
            Сохранить
          </button>
        </div>
      </form>
    </section>
  );
}

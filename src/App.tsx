import { FormEvent, useEffect, useRef, useState } from "react";
import "./App.css";

function Time({ datetime }: { datetime: Date }) {
  return (
    <time dateTime={datetime.toISOString()}>{datetime.toLocaleString()}</time>
  );
}

const timeouts: Record<number, number> = {};

function App() {
  const alarmsRef = useRef<number[]>([]);
  const [date, setDate] = useState(new Date());
  const [datetime, setDateTime] = useState(new Date());
  const [alarms, setAlarms] = useState<number[]>([]);

  useEffect(() => {
    // THIS IS THE MAGIC PART
    alarmsRef.current = alarms;
  }, [alarms]);

  function setAlarm(e: FormEvent) {
    e.preventDefault();

    const targetTime = datetime.getTime();

    if (alarms.find((alarm) => alarm === targetTime)) return true;

    setAlarms([...alarms, targetTime].sort((a, b) => a - b));

    // Calculate the time difference between the current time and the target time
    const currentTime = new Date();

    const timeDiff = targetTime - currentTime.getTime();
    console.log(targetTime, currentTime.getTime(), timeDiff);

    timeouts[targetTime] = setTimeout(() => {
      unsetAlarm(targetTime);

      var alarmAudio = document.getElementById("alarm") as HTMLAudioElement;

      if (alarmAudio) {
        alarmAudio.play();
      }
    }, timeDiff);
  }

  function unsetAlarm(el: number) {
    setAlarms(alarmsRef.current.filter((alarm) => alarm !== el));

    if (timeouts[el]) {
      clearTimeout(el);
    }
  }

  function tick() {
    setDate(new Date());
  }

  setInterval(tick, 1000);

  return (
    <>
      <h1>The clock no-one thought of</h1>
      <p>
        <span>Time in local timezone: </span>
        <strong>
          <Time datetime={date} />
        </strong>
      </p>

      <form onSubmit={setAlarm}>
        <input
          type="datetime-local"
          name="datetime"
          onChange={(e) => setDateTime(new Date(e.target.value))}
          min={date.toISOString().slice(0, -8)}
          required
        />
        <input type="submit" value="+" />
      </form>

      <>
        <h2>Alarms</h2>
        {alarms.length ? (
          <ul>
            {alarms.map((alarm) => (
              <li key={alarm}>
                <Time datetime={new Date(alarm)} />
                <button onClick={() => unsetAlarm(alarm)}>-</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>None</p>
        )}
      </>
    </>
  );
}

export default App;

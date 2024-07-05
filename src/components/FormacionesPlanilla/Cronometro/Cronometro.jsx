import { useEffect, useState } from "react";
import { ButtonsContainer, CronometroContainer, CronometroH1, CronometroWrapper } from "./CronometroStyles";
import { HiArrowPath, HiMiniPauseCircle, HiMiniPlayCircle } from "react-icons/hi2";
import { useSelector } from "react-redux";

function Cronometro() {
  const [diff, setDiff] = useState(null);
  const [initial, setInitial] = useState(null);
  const [paused, setPaused] = useState(true);

  const matchState = useSelector((state) => state.planillero.timeMatch.matchState);

  const tick = () => {
    if (!paused) {
      setDiff(new Date(+new Date() - initial));
    }
  };

  const start = () => {
    if (!initial) {
      setInitial(+new Date());
    }
    setPaused(false);
  };

  const pause = () => {
    setPaused(true);
  };

  const reset = () => {
    setInitial(null);
    setDiff(null);
    setPaused(true);
  };

  useEffect(() => {
    localStorage.setItem(
      "cronometroData",
      JSON.stringify({ initial, diff, paused })
    );
  }, [initial, diff, paused]);

  useEffect(() => {
    if (initial && !paused) {
      const timerId = setInterval(tick, 1000);
      return () => clearInterval(timerId);
    }
  }, [initial, paused]);

  useEffect(() => {
    if (matchState === "isStarted" && !initial) {
      start();
    } else if (matchState === "isFinish") {
      pause();
    }
  }, [matchState]);

  useEffect(() => {
    localStorage.setItem(
      "cronometroData",
      JSON.stringify({ storedInitial: initial, storedDiff: diff, storedPaused: paused })
    );
  }, [initial, diff, paused]);

  return (
    <CronometroContainer>
      <CronometroWrapper>
        <CronometroH1>{timeFormat(diff)}</CronometroH1>
        <ButtonsContainer>
          {paused ? (
            <button onClick={start}>
              <HiMiniPlayCircle />
            </button>
          ) : (
            <>
              <button onClick={pause}>
                <HiMiniPauseCircle />
              </button>
              <button onClick={reset}>
                <HiArrowPath />
              </button>
            </>
          )}
        </ButtonsContainer>
      </CronometroWrapper>
    </CronometroContainer>
  );
}

const timeFormat = (date) => {
  if (!date) return "00:00:00";

  let hh = date.getUTCHours();
  let mm = date.getUTCMinutes();
  let ss = date.getSeconds();

  hh = hh < 10 ? "0" + hh : hh;
  mm = mm < 10 ? "0" + mm : mm;
  ss = ss < 10 ? "0" + ss : ss;

  return `${hh}:${mm}:${ss}`;
};

export default Cronometro;

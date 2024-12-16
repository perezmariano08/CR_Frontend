import React, { useEffect, useState } from "react";
import { ButtonsContainer, CronometroH1, CronometroWrapper } from "./CronometroStyles";
import { HiArrowPath, HiMiniPauseCircle, HiMiniPlayCircle } from "react-icons/hi2";
import { useSelector } from "react-redux";

function Cronometro() {
  const [diff, setDiff] = useState(null);
  const [initial, setInitial] = useState(null);
  const [paused, setPaused] = useState(true);

  // const partidoId = useSelector((state) => state.planillero.timeMatch.idMatch);
  const match = useSelector((state) => state.match);
  const matchCorrecto = match.find((m) => m.ID === partidoId);
  const matchState = matchCorrecto?.matchState;

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem(`cronometroData_${partidoId}`));
    if (savedData) {
      setInitial(savedData.initial);
      setDiff(savedData.diff);
      setPaused(savedData.paused);
    }
  }, [partidoId]);

  const tick = () => {
    if (!paused) {
      setDiff(new Date(+new Date() - initial));
    }
  };

  const start = () => {
    if (!initial) {
      setInitial(+new Date());
    } else {
      setInitial(+new Date() - diff);
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
    localStorage.removeItem(`cronometroData_${partidoId}`);
  };

  useEffect(() => {
    if (initial && !paused) {
      const timerId = setInterval(tick, 1000);
      return () => clearInterval(timerId);
    }
  }, [initial, paused]);

  useEffect(() => {
    localStorage.setItem(
      `cronometroData_${partidoId}`,
      JSON.stringify({ initial, diff, paused })
    );
  }, [initial, diff, paused, partidoId]);

  useEffect(() => {
    if (matchState === "isStarted" && !initial) {
      start();
    } else if (matchState === "isFinish") {
      pause();
    }
  }, [matchState]);

  return (
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
  );
}

const timeFormat = (date) => {
  if (!date || !(date instanceof Date)) return "00:00:00";

  let hh = date.getUTCHours();
  let mm = date.getUTCMinutes();
  let ss = date.getUTCSeconds();

  hh = hh < 10 ? "0" + hh : hh;
  mm = mm < 10 ? "0" + mm : mm;
  ss = ss < 10 ? "0" + ss : ss;

  return `${hh}:${mm}:${ss}`;
};

export default Cronometro;

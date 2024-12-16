import React, { useEffect, useState } from "react";
import { ButtonsContainer, CronometroH1, CronometroWrapper } from "./CronometroStyles";
import { HiArrowPath, HiMiniPauseCircle, HiMiniPlayCircle } from "react-icons/hi2";
import { useSelector } from "react-redux";

function Cronometro({ partido }) {
  const [diff, setDiff] = useState(null);
  const [initial, setInitial] = useState(null);
  const [paused, setPaused] = useState(true);

  const estadoPartido = partido.estado;

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem(`cronometroData_${partido.id_partido}`));
    if (savedData) {
      setInitial(savedData.initial);
      setDiff(savedData.diff);
      setPaused(savedData.paused);
    }
  }, [partido.id_partido]);

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
    localStorage.removeItem(`cronometroData_${partido.id_partido}`);
  };

  useEffect(() => {
    if (initial && !paused) {
      const timerId = setInterval(tick, 1000);
      return () => clearInterval(timerId);
    }
  }, [initial, paused]);

  useEffect(() => {
    localStorage.setItem(
      `cronometroData_${partido.id_partido}`,
      JSON.stringify({ initial, diff, paused })
    );
  }, [initial, diff, paused, partido.id_partido]);

  useEffect(() => {
    if (estadoPartido === "C" && !initial) {
      start();
    } else if (estadoPartido === "T") {
      pause();
    }
  }, [estadoPartido]);

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

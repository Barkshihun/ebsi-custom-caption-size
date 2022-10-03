"use strict";
const normalscreenFontSize = document.getElementById("normalscreenFontSize");
const fullscreenFontSize = document.getElementById("fullscreenFontSize");
const setupCaption = document.getElementById("setupCaption");
const cont = setupCaption.querySelector(".cont");
const setupConfirmBtn = setupCaption.querySelector("#setupConfirm");
const normalDl = cont.getElementsByTagName("dl")[0];
const fullDl = cont.getElementsByTagName("dl")[1];
const dds = cont.getElementsByTagName("dd");
const mediaplayer = document.querySelector("#mediaplayer");
const DEFAULT_NORMAL_FONT_SIZE = 15;
const DEFAULT_FULLSCREEN_FONT_SIZE = 20;
const NORMALSCREEN_FONT_SIZE = "normalscreenFontSize";
const FULLSCREEN_FONT_SIZE = "fullscreenFontSize";

const makeCustomOption = (parentNode) => {
  const customOption = document.createElement("option");
  customOption.className = "barkCustomFontSize";
  parentNode.appendChild(customOption);
};
const setCustomOption = (parentNode, fontSize) => {
  const barkCustomFontSize = parentNode.querySelector(".barkCustomFontSize");
  barkCustomFontSize.innerText = fontSize;
  barkCustomFontSize.value = fontSize;
  barkCustomFontSize.selected = true;
};
const changeBothCaptionSize = () => {
  const barkNormalInput = document.getElementById("barkNormalInput");
  const barkFullInput = document.getElementById("barkFullInput");
  const normalInputValue = parseInt(barkNormalInput.value);
  const fullInputValue = parseInt(barkFullInput.value);
  if (normalInputValue) {
    chrome.storage.local.set({ [NORMALSCREEN_FONT_SIZE]: normalInputValue });
    setCustomOption(normalscreenFontSize, normalInputValue);
    changeDt(normalDl, normalInputValue);
  }
  if (fullInputValue) {
    chrome.storage.local.set({ [FULLSCREEN_FONT_SIZE]: fullInputValue });
    setCustomOption(fullscreenFontSize, fullInputValue);
    changeDt(fullDl, fullInputValue);
  }
  barkNormalInput.value = "";
  barkFullInput.value = "";
};
const setDt = (dl, fontSize) => {
  const dt = dl.querySelector("dt");
  const span = document.createElement("span");
  if (!fontSize) {
    if (dl === normalDl) {
      span.innerText = `현재 폰트 크기: ${DEFAULT_NORMAL_FONT_SIZE}px`;
    } else {
      span.innerText = `현재 폰트 크기: ${DEFAULT_FULLSCREEN_FONT_SIZE}px`;
    }
  } else {
    span.innerText = `현재 폰트 크기: ${fontSize}px`;
  }
  span.style = "color:gray; margin-left: 6px;";
  dt.appendChild(span);
};
const changeDt = (dl, fontSize) => {
  const dt = dl.querySelector("dt");
  const span = dt.querySelector("span");
  span.innerText = `현재 폰트 크기: ${fontSize}px`;
};
const makeCustomForm = (dl) => {
  const form = document.createElement("form");
  const input = document.createElement("input");
  input.addEventListener("keydown", (event) => event.stopPropagation());
  input.placeholder = dl === normalDl ? "자막 폰트 (일반 화면)" : "자막 폰트 (풀스크린)";
  input.id = dl === normalDl ? "barkNormalInput" : "barkFullInput";
  input.type = "number";
  input.min = 1;
  input.step = 1;
  form.style = "display:flex; justify-content:center; align-items:center; margin-top: 10px;";
  form.appendChild(input);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    changeBothCaptionSize();
    setupConfirmBtn.click();
  });
  dl.appendChild(form);
};
const makeConfigureBtn = () => {
  const btn = document.createElement("button");
  btn.innerText = "확인";
  btn.className = "_setupBtn";
  btn.addEventListener("click", () => {
    changeBothCaptionSize();
    setupConfirmBtn.click();
  });
  const btnWrap = setupCaption.querySelector(".btnWrap");
  btnWrap.prepend(btn);
};

const init = (mutations) => {
  if ((mutations.length === 1 || mutations.length === 2) && mutations[0].target.classList.contains("mpv-duration-text")) {
    setupConfirmBtn.style = "display: none;";
    makeConfigureBtn();
    dds[0].style = "display: none;";
    dds[1].style = "display: none;";
    makeCustomOption(normalscreenFontSize);
    makeCustomOption(fullscreenFontSize);
    chrome.storage.local.get([NORMALSCREEN_FONT_SIZE], (result) => {
      if (result[NORMALSCREEN_FONT_SIZE]) {
        setCustomOption(normalscreenFontSize, result[NORMALSCREEN_FONT_SIZE]);
        setDt(normalDl, result[NORMALSCREEN_FONT_SIZE]);
        setupConfirmBtn.click();
      } else {
        setDt(normalDl);
      }
    });
    chrome.storage.local.get([FULLSCREEN_FONT_SIZE], (result) => {
      if (result[FULLSCREEN_FONT_SIZE]) {
        setCustomOption(fullscreenFontSize, result[FULLSCREEN_FONT_SIZE]);
        setDt(fullDl, result[FULLSCREEN_FONT_SIZE]);
        setupConfirmBtn.click();
      } else {
        setDt(fullDl);
      }
    });
    makeCustomForm(normalDl);
    makeCustomForm(fullDl);
  }
};
const observer = new MutationObserver(init);
observer.observe(mediaplayer, { childList: true, subtree: true });

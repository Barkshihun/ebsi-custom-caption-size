"use strict";
const normalscreenFontSizeSelectElem = document.getElementById("normalscreenFontSize");
const fullscreenFontSizeSelectElem = document.getElementById("fullscreenFontSize");
const setupCaption = document.getElementById("setupCaption");
const cont = setupCaption.querySelector(".cont");
const setupConfirmBtn = setupCaption.querySelector("#setupConfirm");
const normalDl = cont.getElementsByTagName("dl")[0];
const fullDl = cont.getElementsByTagName("dl")[1];
const dds = cont.getElementsByTagName("dd");
const mediaplayer = document.querySelector("#mediaplayer");

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
    chrome.storage.local.set({ normalscreenFontSize: normalInputValue });
    setCustomOption(normalscreenFontSizeSelectElem, normalInputValue);
    changeDt(normalDl, normalInputValue);
  }
  if (fullInputValue) {
    chrome.storage.local.set({ fullscreenFontSize: fullInputValue });
    setCustomOption(fullscreenFontSizeSelectElem, fullInputValue);
    changeDt(fullDl, fullInputValue);
  }
  barkNormalInput.value = "";
  barkFullInput.value = "";
};
const setDt = (dl, fontSize) => {
  const dt = dl.querySelector("dt");
  const span = document.createElement("span");
  span.innerText = `현재 폰트 크기: ${fontSize}px`;
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
  if (mutations[0].addedNodes[0]?.nodeName === "VIDEO") {
    setupConfirmBtn.style = "display: none;";
    makeConfigureBtn();
    dds[0].style = "display: none;";
    dds[1].style = "display: none;";
    makeCustomOption(normalscreenFontSizeSelectElem);
    makeCustomOption(fullscreenFontSizeSelectElem);
    chrome.storage.local.get({ normalscreenFontSize: 15, fullscreenFontSize: 20 }, (result) => {
      setCustomOption(normalscreenFontSizeSelectElem, result.normalscreenFontSize);
      setDt(normalDl, result.normalscreenFontSize);
      setCustomOption(fullscreenFontSizeSelectElem, result.fullscreenFontSize);
      setDt(fullDl, result.fullscreenFontSize);
      setupConfirmBtn.click();
    });
    makeCustomForm(normalDl);
    makeCustomForm(fullDl);
    observer.disconnect();
  }
};
const observer = new MutationObserver(init);
window.onload = () => {
  observer.observe(mediaplayer, { childList: true, subtree: true });
};

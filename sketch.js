let table; // 用於存放 CSV 資料
let question = "";
let options = [];
let correctAnswer = "";
let radio;
let submitButton;
let result = "";
let currentQuestionIndex = 0; // 當前題目索引
let correctCount = 0; // 答對題數
let incorrectCount = 0; // 答錯題數

function preload() {
  // 載入 CSV 檔案
  table = loadTable("questions.csv", "csv", "header");
  if (table.getRowCount() === 0) {
    console.error("CSV 資料未正確載入！");
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  loadQuestion(currentQuestionIndex);

  // 建立選項 (radio 按鈕)
  radio = createRadio();
  radio.style("font-size", "25px");
  radio.style("color", "#95b8d1");
  radio.style("text-align", "center"); // 文字置中
  radio.style("display", "inline-block"); // 讓選項水平置中
  radio.style("width", "100%"); // 設定寬度為 100%
  radio.position(0, windowHeight / 2 - 20); // 垂直置中

  // 建立按鈕
  submitButton = createButton("下一題");
  submitButton.style("font-size", "20px");
  submitButton.position(windowWidth / 2 - 30, windowHeight / 2 + 140);
  submitButton.mousePressed(handleButtonClick);
}

function draw() {
  background("#ffe5d9");
  fill("#d8e2dc");
  noStroke();
  let rectWidth = windowWidth / 2;
  let rectHeight = windowHeight / 2;
  let rectX = (windowWidth - rectWidth) / 2;
  let rectY = (windowHeight - rectHeight) / 2;
  rect(rectX, rectY, rectWidth, rectHeight);

  // 題目置中並自動換行
  fill("#9d8189");
  textSize(35);
  textAlign(LEFT, TOP); // 文字從左上角開始對齊
  textWrap(WORD); // 啟用文字自動換行
  let textX = rectX + 20; // 框框內的左邊距
  let textY = rectY + 20; // 框框內的上邊距
  let textWidth = rectWidth - 40; // 框框內的寬度，留出左右邊距
  text(question, textX, textY, textWidth); // 限制文字在框內顯示

  // 結果文字置中
  fill("#000");
  textSize(25);
  textAlign(CENTER, CENTER);
  text(result, windowWidth / 2, windowHeight / 2 + 200);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  radio.position(0, windowHeight / 2 - 20); // 調整選項垂直置中
  submitButton.position(windowWidth / 2 - 30, windowHeight / 2 + 140);
}

function loadQuestion(index) {
  if (index < table.getRowCount()) {
    let row = table.getRow(index);
    question = row.get("question");
    options = [
      row.get("option1"),
      row.get("option2"),
      row.get("option3"),
      row.get("option4"),
    ];
    correctAnswer = row.get("answer");

    console.log("載入的選項：", options); // 檢查選項是否正確載入

    if (radio) {
      radio.elt.innerHTML = ""; // 清空舊的選項
      for (let i = 0; i < options.length; i++) {
        radio.option(options[i], options[i]); // 新增選項
      }
      radio.value(""); // 確保未預設選中任何選項
    }
  } else {
    question = "測驗結束！";
    options = [];
    correctAnswer = "";
  }
}

function handleButtonClick() {
  if (currentQuestionIndex < table.getRowCount()) {
    checkAnswer();
    currentQuestionIndex++;
    if (currentQuestionIndex < table.getRowCount()) {
      loadQuestion(currentQuestionIndex);
    } else {
      // 測驗結束
      question = `測驗結束！\n答對題數：${correctCount}\n答錯題數：${incorrectCount}`;
      result = "";
      submitButton.html("再試一次");
    }
  } else {
    // 重置測驗
    resetQuiz();
  }
}

function checkAnswer() {
  let selected = radio.value();
  if (selected === correctAnswer) {
    result = "答對了";
    correctCount++;
  } else {
    result = "答錯了";
    incorrectCount++;
  }
}

function resetQuiz() {
  currentQuestionIndex = 0;
  correctCount = 0;
  incorrectCount = 0;
  result = "";
  loadQuestion(currentQuestionIndex);
  submitButton.html("下一題");
}

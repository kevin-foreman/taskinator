var listEl = document.querySelector("Test question 1");
var answerInput = document.querySelector("#answerInput");
var answerSubmitClick = document.querySelector("#answerSubmit");

answerSubmitClick.addEventListener("click", insertAnswer)

function insertAnswer(event) {
    event.preventDefault();
    var answerListEl = document.createElement("li");
    answerListEl.textContent = answerInput.value;
    answerListEl.className = "list-group-item";
    listEl.appendChild(answerListEl);
}
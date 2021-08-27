"use strict";
//importing dictionary words
let engWordsLst;
const button = document.getElementById('button'); //https://raw.githubusercontent.com/redbo/scrabble/master/dictionary.txt
//https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt
fetch('https://raw.githubusercontent.com/redbo/scrabble/master/dictionary.txt')
    .then(response => response.text())
    .then(data => engWordsLst = data.replace(/\r/g, '').split('\n'))
    .catch(error => {
        button.disabled = true
        console.log('Error', error)
        alert('The dictionary could not be found')
    });
//callback function to use after submit
function onSubmit() {
    const start = document.getElementById("S").value;
    const middle = document.getElementById("M").value;
    const end = document.getElementById("E").value;
    const letters = (document.getElementById("Letters").value + start + end + middle).toLowerCase();
    const LENGTH_START = document.getElementById("StartR").value;
    const LENGTH_END = document.getElementById("EndR").value;
    let candidateWordLst = conditionChecker(start, middle, end, LENGTH_START, LENGTH_END, engWordsLst)
    candidateWordLst = engineBody(candidateWordLst, letters);
    let result = pointSorter(candidateWordLst)
    openPopUp()
    let extrasRef = document.getElementById('extras')
    let headerRef = document.getElementById('bestWord')
    let pointsRef = document.getElementById('points')
    extrasRef.innerHTML = ''
    pointsRef.innerHTML = ''
    headerRef.innerHTML = ''
    try {
        pointsRef.innerHTML = result[0][1]
        headerRef.innerHTML = result[0][0]
    } catch (error) {
        headerRef.innerHTML = '<br><br><h2 id="extras">Sorry, no words found :(</h2><br><br>'
    }
    extrasRef.innerHTML = htmlGenerator(result, 9)
}
//scrabble engine body
function conditionChecker(start, middle, end, LENGTH_START, LENGTH_END, engWordsLst) {
    let validWordsLst = [];
    let useLength = LENGTH_END && LENGTH_START ? true : false;
    let lettersTest = start || middle || end ? true : false;
    for (let i = 0; i < engWordsLst.length; i++) {
        let currentWord = engWordsLst[i].toLowerCase();
        if (currentWord.length <= LENGTH_END && currentWord.length >= LENGTH_START || !useLength) {
            if (start == currentWord[0] || end == currentWord[currentWord.length - 1] || currentWord.includes(middle) && middle != '' || !lettersTest) {
                validWordsLst.push(currentWord);
            }
        }
    }
    return validWordsLst;
}
// Checking if letters are in word
function includesLetters(word, letters) {
    for (let i = 0; i < letters.length; i++) {
        if (word.includes(letters[i])) {
            word = word.replace(letters[i], '');
            if (word.length == 0) {
                return true;
            }
        }
    }
    return false;
}
// Final function that runs all code together
function engineBody(candidateWordLst, letters) {
    let finalWordLst = [];
    for (let i = 0; i < candidateWordLst.length; i++) {
        let word = candidateWordLst[i]
        if (includesLetters(word, letters)) {
            let wordValue = pointsCalc(word);
            finalWordLst.push([word, wordValue]);
        }
    }
    return finalWordLst;
}
//point system
const points_dict = {

    "A": 1,

    "B": 4,

    "C": 4,

    "D": 2,

    "E": 1,

    "F": 4,

    "G": 3,

    "H": 3,

    "I": 1,

    "J": 10,

    "K": 5,

    "L": 2,

    "M": 4,

    "N": 2,

    "O": 1,

    "P": 4,

    "Q": 10,

    "R": 1,

    "S": 1,

    "T": 1,

    "U": 2,

    "V": 5,

    "W": 4,

    "X": 8,

    "Y": 3,

    "Z": 10

};
function pointsCalc(word) {
    let wordValue = 0
    for (let i = 0; i < word.length; i++) {
        let letter = word[i].toUpperCase();
        let letterValue = points_dict[letter];
        wordValue += letterValue;
    }
    return wordValue
}
function pointSorter(finalWordLst) {
    finalWordLst.sort((a, b) => b[1] - a[1]);
    return finalWordLst
}
//code to close popup
const popUp = document.querySelector('.popUp');
function closePopUp(e) {
    if (e.target == popUp) {
        popUp.style.display = 'none'
    }
}
function openPopUp(e) {
    popUp.style.display = 'block'
}
function htmlGenerator(validWordsLst, num) {
    let html = ''
    for (let i = 1; i < num; i++) {
        html += `<br><h1 id="extras">${validWordsLst[i][0]}</h1>&nbsp; &nbsp; &nbsp; &nbsp; <h2 id="extraspoints">${validWordsLst[i][1]}</h2>`;
    }
    return html
}
button.addEventListener('click', onSubmit);
window.addEventListener('click', closePopUp);
document.getElementById('year').innerHTML = new Date().getFullYear()

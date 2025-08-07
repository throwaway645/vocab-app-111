// Get all the elements we need
const addTab = document.getElementById('add-tab');
const studyTab = document.getElementById('study-tab');
const listTab = document.getElementById('list-tab');
const addSection = document.getElementById('add-section');
const studySection = document.getElementById('study-section');
const listSection = document.getElementById('list-section');
const wordInput = document.getElementById('word-input');
const definitionInput = document.getElementById('definition-input');
const addWordButton = document.getElementById('add-word');
const flashcard = document.getElementById('flashcard');
const flipButton = document.getElementById('flip-card');
const nextButton = document.getElementById('next-card');
const wordList = document.getElementById('word-list');

// Store our vocabulary words
let vocabWords = JSON.parse(localStorage.getItem('vocabWords')) || [];
let currentCardIndex = 0;
let showingDefinition = false;

// Tab switching
addTab.addEventListener('click', () => {
    setActiveTab('add');
});

studyTab.addEventListener('click', () => {
    setActiveTab('study');
    showCurrentCard();
});

listTab.addEventListener('click', () => {
    setActiveTab('list');
    displayWordList();
});

function setActiveTab(tab) {
    // Remove active class from all tabs and sections
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    // Add active class to selected tab and section
    if (tab === 'add') {
        addTab.classList.add('active');
        addSection.classList.add('active');
    } else if (tab === 'study') {
        studyTab.classList.add('active');
        studySection.classList.add('active');
    } else if (tab === 'list') {
        listTab.classList.add('active');
        listSection.classList.add('active');
    }
}

// Add new word
addWordButton.addEventListener('click', () => {
    const word = wordInput.value.trim();
    const definition = definitionInput.value.trim();
    
    if (word && definition) {
        vocabWords.push({ word, definition });
        localStorage.setItem('vocabWords', JSON.stringify(vocabWords));
        
        // Clear inputs
        wordInput.value = '';
        definitionInput.value = '';
        
        // Show success message briefly
        addWordButton.textContent = 'Added!';
        setTimeout(() => {
            addWordButton.textContent = 'Add Word';
        }, 1000);
    }
});

// Allow Enter key to add words
wordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') definitionInput.focus();
});

definitionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addWordButton.click();
});

// Flashcard functions
function showCurrentCard() {
    if (vocabWords.length === 0) {
        flashcard.innerHTML = '<p>Add some words first!</p>';
        return;
    }
    
    const currentWord = vocabWords[currentCardIndex];
    if (showingDefinition) {
        flashcard.innerHTML = `<p><strong>Definition:</strong><br>${currentWord.definition}</p>`;
    } else {
        flashcard.innerHTML = `<p><strong>Word:</strong><br>${currentWord.word}</p>`;
    }
}

// Flip card
flipButton.addEventListener('click', () => {
    if (vocabWords.length > 0) {
        showingDefinition = !showingDefinition;
        showCurrentCard();
    }
});

// Next card
nextButton.addEventListener('click', () => {
    if (vocabWords.length > 0) {
        currentCardIndex = (currentCardIndex + 1) % vocabWords.length;
        showingDefinition = false;
        showCurrentCard();
    }
});

// Click card to flip
flashcard.addEventListener('click', () => {
    if (vocabWords.length > 0) {
        showingDefinition = !showingDefinition;
        showCurrentCard();
    }
});

// Display word list
function displayWordList() {
    if (vocabWords.length === 0) {
        wordList.innerHTML = '<p>No words added yet!</p>';
        return;
    }
    
    let listHTML = `<div class="word-count">Total words: ${vocabWords.length}</div>`;
    
    vocabWords.forEach((item, index) => {
        listHTML += `
            <div class="word-item">
                <div class="word-content">
                    <h3>${item.word}</h3>
                    <p>${item.definition}</p>
                </div>
                <button class="delete-btn" onclick="deleteWord(${index})">Delete</button>
            </div>
        `;
    });
    
    wordList.innerHTML = listHTML;
}

// Delete word function
function deleteWord(index) {
    if (confirm('Are you sure you want to delete this word?')) {
        vocabWords.splice(index, 1);
        localStorage.setItem('vocabWords', JSON.stringify(vocabWords));
        displayWordList();
        
        // Reset flashcard if we deleted the current one
        if (currentCardIndex >= vocabWords.length) {
            currentCardIndex = 0;
        }
    }
}

// Initialize
showCurrentCard();
displayWordList();
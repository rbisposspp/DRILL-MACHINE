'use strict';

// --- Constants ---
const TENSE_SIMPLE_PRESENT = 'simple_present';
const TENSE_SIMPLE_PAST = 'simple_past';

const SENTENCE_TYPE_AFFIRMATIVE = 'affirmative';
const SENTENCE_TYPE_NEGATIVE = 'negative';
const SENTENCE_TYPE_INTERROGATIVE = 'interrogative';

// --- Pre-made Verb Models ---
const PREMADE_VERB_MODELS = {
    "daily_routine_a1_a1plus": {
        displayName: "Daily Routine (A1/A1+)",
        models: [
            { verb: "wake up", complement: "at 7 o'clock" }, { verb: "wake up", complement: "early" },
            { verb: "get up", complement: "" },
            { verb: "have", complement: "breakfast" }, { verb: "have", complement: "a shower" },
            { verb: "eat", complement: "toast" }, { verb: "eat", complement: "cereal" },
            { verb: "drink", complement: "coffee" }, { verb: "drink", complement: "tea" },
            { verb: "go", complement: "to school" }, { verb: "go", complement: "to work" },
            { verb: "take", complement: "the bus" }, { verb: "take", complement: "a taxi" },
            { verb: "walk", complement: "to the shop" },
            { verb: "have", complement: "lunch" },
            { verb: "finish", complement: "work" }, { verb: "finish", complement: "school" },
            { verb: "come", complement: "home" },
            { verb: "watch", complement: "TV" },
            { verb: "read", complement: "a book" },
            { verb: "go", complement: "to bed" }, { verb: "go", complement: "to sleep" }
        ]
    },
    "free_time_children_a1_a1plus": {
        displayName: "Free Time - Children (A1/A1+)",
        models: [
            { verb: "play", complement: "with toys" }, { verb: "play", complement: "in the park" },
            { verb: "play", complement: "football" }, { verb: "play", complement: "games" },
            { verb: "watch", complement: "cartoons" }, { verb: "watch", complement: "a film" },
            { verb: "draw", complement: "pictures" }, { verb: "draw", complement: "animals" },
            { verb: "ride", complement: "a bike" }, { verb: "ride", complement: "a scooter" },
            { verb: "read", complement: "story books" },
            { verb: "listen", complement: "to stories" }, { verb: "listen", complement: "to songs" },
            { verb: "sing", complement: "songs" },
            { verb: "dance", complement: "" },
            { verb: "go", complement: "to the playground" },
            { verb: "visit", complement: "grandparents" }, { verb: "visit", complement: "friends" },
            { verb: "help", complement: "my mom" }, { verb: "help", complement: "my dad" },
            { verb: "like", complement: "ice cream" }, { verb: "like", complement: "sweets" }
        ]
    },
    "free_time_adults_a1plus_a2": {
        displayName: "Free Time - Adults (A1+/A2)",
        models: [
            { verb: "watch", complement: "movies" }, { verb: "watch", complement: "series online" },
            { verb: "listen", complement: "to music" }, { verb: "listen", complement: "to podcasts" },
            { verb: "read", complement: "books" }, { verb: "read", complement: "the news" },
            { verb: "go", complement: "to the cinema" }, { verb: "go", complement: "shopping" },
            { verb: "go", complement: "for a walk" }, { verb: "go", complement: "to a cafe" },
            { verb: "meet", complement: "friends" },
            { verb: "eat", complement: "out" }, { verb: "eat", complement: "in a restaurant" },
            { verb: "cook", complement: "dinner" }, { verb: "cook", complement: "something new" },
            { verb: "do", complement: "exercise" }, { verb: "exercise", complement: "" },
            { verb: "play", complement: "the guitar" }, { verb: "play", complement: "video games" },
            { verb: "study", complement: "a new language" },
            { verb: "travel", complement: "to new places" }, { verb: "travel", complement: "" },
            { verb: "relax", complement: "at home" }, { verb: "relax", complement: "in the garden" }
        ]
    },
     "food_drink_a1_a1plus": {
        displayName: "Food & Drink (A1/A1+)",
        models: [
            { verb: "eat", complement: "fruit" }, { verb: "eat", complement: "vegetables" },
            { verb: "drink", complement: "water" }, { verb: "drink", complement: "juice" },
            { verb: "like", complement: "chocolate" }, { verb: "like", complement: "pizza" },
            { verb: "want", complement: "a sandwich" }, { verb: "want", complement: "some coffee" },
            { verb: "cook", complement: "pasta" }, { verb: "cook", complement: "rice" },
            { verb: "buy", complement: "milk" }, { verb: "buy", complement: "bread" },
            { verb: "order", complement: "a takeaway" },
            { verb: "have", complement: "tea" }, { verb: "have", complement: "a snack" },
            { verb: "make", complement: "a cake" }, { verb: "make", complement: "a salad" },
            { verb: "try", complement: "new food" }
        ]
    }
};


// --- DOM Element Helper ---
function getElem(id, critical = true) {
    const element = document.getElementById(id);
    if (!element && critical) console.error(`Critical DOM element #${id} not found.`);
    return element;
}

// --- DrillAudio Namespace ---
const DrillAudio = {
    synth: window.speechSynthesis,
    voices: [],
    selectedVoices: { us_male: null, us_female: null, uk_male: null, uk_female: null },
    rate: 1.0,
    isCancelling: false,
    beepElement: null,
    errorElement: null,
    
    preferredVoicesMap: {
        us_female: [],
        us_male: [],
        uk_female: [],
        uk_male: []
    },

    init() {
        this.beepElement = document.getElementById('beepSound');
        this.errorElement = document.getElementById('pronunciationError');

        if (typeof this.synth !== 'undefined') {
            this.populateVoices();
            if (typeof this.synth.onvoiceschanged !== 'undefined') {
                this.synth.onvoiceschanged = () => this.populateVoices();
            }
        } else {
            console.warn("Speech Synthesis API not supported.");
            this.disableAudioControls("TTS not supported by this browser.");
        }

        const slider = document.getElementById('speechRateSlider');
        const valueDisplay = document.getElementById('speechRateValue');
        if (slider && valueDisplay) {
            this.rate = parseFloat(slider.value);
            valueDisplay.textContent = `${this.rate.toFixed(1)}x`;
            slider.addEventListener('input', () => {
                this.rate = parseFloat(slider.value);
                valueDisplay.textContent = `${this.rate.toFixed(1)}x`;
            });
        } else { 
             if(slider) this.rate = parseFloat(slider.value);
        }

        document.querySelectorAll('input[name="ttsVoice"]').forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    if (this.errorElement) {
                        this.errorElement.classList.add('hidden');
                        this.errorElement.textContent = '';
                    }
                }
            });
        });
    },

    disableAudioControls(message) {
        const listenBtn = document.getElementById('listenModelButton');
        if (listenBtn) listenBtn.disabled = true;
        
        document.querySelectorAll('input[name="ttsVoice"]').forEach(r => r.disabled = true);
        
        const slider = document.getElementById('speechRateSlider');
        if (slider) slider.disabled = true;

        if (this.errorElement) {
            this.errorElement.textContent = message;
            this.errorElement.classList.remove('hidden');
        }
    },

    populateVoices() {
        if (!this.synth) return;
        const allVoices = this.synth.getVoices();
        
        if (allVoices.length === 0 && typeof this.synth.onvoiceschanged !== 'undefined' && this.voices.length === 0) {
            return;
        }

        this.voices = allVoices.filter(voice => voice.lang.startsWith('en'));

        for (const type in this.preferredVoicesMap) {
            this.selectedVoices[type] = null;
            if (this.preferredVoicesMap[type] && this.preferredVoicesMap[type].length > 0) {
                for (const n of this.preferredVoicesMap[type]) {
                    const fV = this.voices.find(v => v.name === n && v.lang.toLowerCase().startsWith(type.substring(0, 2)));
                    if (fV) { this.selectedVoices[type] = fV; break; }
                }
            }
            if (!this.selectedVoices[type]) {
                const langPrefix = type.startsWith('us') ? 'en-us' : 'en-gb';
                const isFemale = type.includes('female');
                let fallbackVoice = this.voices.find(v =>
                    v.lang.toLowerCase().startsWith(langPrefix) &&
                    (isFemale ? (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('ava'))
                                : (!v.name.toLowerCase().includes('female') && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('daniel'))))
                );
                if (!fallbackVoice) fallbackVoice = this.voices.find(v => v.lang.toLowerCase().startsWith(langPrefix));
                this.selectedVoices[type] = fallbackVoice;
            }
        }
        
        const voiceRadios = document.querySelectorAll('input[name="ttsVoice"]');
        let firstEnabledRadio = null;
        voiceRadios.forEach(radio => {
            radio.disabled = !this.selectedVoices[radio.value];
            const label = document.querySelector(`label[for="${radio.id}"]`);
            if (label) {
                label.style.opacity = radio.disabled ? 0.5 : 1;
                label.style.cursor = radio.disabled ? 'not-allowed' : 'pointer';
                label.title = radio.disabled ? "Voice not available" : "";
            }
            if (!radio.disabled && !firstEnabledRadio) firstEnabledRadio = radio;
        });

        const checkedRadio = document.querySelector('input[name="ttsVoice"]:checked');
        if ((checkedRadio && checkedRadio.disabled) || (!checkedRadio && firstEnabledRadio)) {
            if (firstEnabledRadio) firstEnabledRadio.checked = true;
        }

        if (this.voices.length === 0 && this.errorElement && this.errorElement.classList.contains('hidden')) {
            this.errorElement.textContent = "No English TTS voices available.";
            this.errorElement.classList.remove('hidden');
        }
    },

    cancel() {
        if (this.synth && this.synth.speaking) {
            this.isCancelling = true;
            this.synth.cancel();
            setTimeout(() => { this.isCancelling = false; }, 100);
        }
    },

    speak(text, onEndCallback, isFinalSegmentInSequence = false) {
        if (!this.synth) {
            if (this.errorElement) {
                 this.errorElement.textContent = "TTS not available.";
                 this.errorElement.classList.remove('hidden');
            }
            if (onEndCallback) onEndCallback(new Error("TTS not available")); 
            return;
        }

        setTimeout(() => {
            if (playerIsPaused || (this.isCancelling && !isFinalSegmentInSequence)) {
                if (onEndCallback) onEndCallback(new Error("cancelled_or_paused"));
                return;
            }
            this.isCancelling = false;

            const utterance = new SpeechSynthesisUtterance(text);
            const selectedVoiceTypeRadio = document.querySelector('input[name="ttsVoice"]:checked');
            const selectedVoiceType = selectedVoiceTypeRadio ? selectedVoiceTypeRadio.value : 'us_female';

            if (this.selectedVoices[selectedVoiceType]) {
                utterance.voice = this.selectedVoices[selectedVoiceType];
                utterance.lang = this.selectedVoices[selectedVoiceType].lang;
            } else {
                utterance.lang = selectedVoiceType.startsWith('us') ? 'en-US' : 'en-GB';
            }
            utterance.rate = this.rate;
            utterance.pitch = 1.0;

            utterance.onend = () => {
                if (!this.isCancelling) {
                    if (onEndCallback) onEndCallback();
                } else {
                    if (onEndCallback) onEndCallback(new Error("cancelled"));
                }
                this.isCancelling = false;
            };
            utterance.onerror = (event) => {
                const wasCancelledByApp = this.isCancelling && (event.error === 'interrupted' || event.error === 'canceled' || event.error === 'cancelled');
                if (!wasCancelledByApp && this.errorElement) {
                    this.errorElement.textContent = `TTS Error: ${event.error}`;
                    this.errorElement.classList.remove('hidden');
                }
                if (onEndCallback) onEndCallback(wasCancelledByApp ? new Error("cancelled") : new Error(event.error));
                this.isCancelling = false;
            };
            this.synth.speak(utterance);
        }, 50);
    },

    playCue(pronoun, complement, sentenceType, tense, structureType, cueType, onDoneCallback) {
        const statusEl = document.getElementById('audioCueStatus');
        if (statusEl) statusEl.textContent = "Listen to the cue...";
        if (this.errorElement) this.errorElement.classList.add('hidden');
        this.cancel();

        const displayComplement = (complement && complement.trim() !== '') ? complement.trim() : "";
        const firstPart = pronoun.charAt(0).toUpperCase() + pronoun.slice(1);

        if (cueType === "full_gap" || cueType === "partial") {
            this.speak(firstPart, (err) => {
                if (err) { onDoneCallback(err); return; }

                if (playerIsPaused || this.isCancelling) { onDoneCallback(new Error("cancelled")); return; }

                if (this.beepElement) {
                    this.beepElement.play().then(() => {
                        const beepDurationMs = (this.beepElement.duration && isFinite(this.beepElement.duration)) ? this.beepElement.duration * 1000 : 200;
                        setTimeout(() => {
                            if (playerIsPaused || this.isCancelling) { onDoneCallback(new Error("cancelled")); return; }
                            if (displayComplement) this.speak(displayComplement, onDoneCallback, true);
                            else onDoneCallback();
                        }, beepDurationMs + 50);
                    }).catch(playErr => {
                        console.warn("Beep sound play failed:", playErr);
                        if (playerIsPaused || this.isCancelling) { onDoneCallback(new Error("cancelled")); return; }
                        if (displayComplement) this.speak(displayComplement, onDoneCallback, true);
                        else onDoneCallback();
                    });
                } else {
                    console.warn("Beep sound element not found.");
                    setTimeout(() => {
                        if (playerIsPaused || this.isCancelling) { onDoneCallback(new Error("cancelled")); return; }
                        if (displayComplement) this.speak(displayComplement, onDoneCallback, true); else onDoneCallback();
                    }, 700);
                }
            });
        } else if (cueType === "visual_only") {
            this.speak("Speak now.", onDoneCallback, true);
        } else {
            console.error("Unknown auditory cue type:", cueType);
            onDoneCallback(new Error("Unknown auditory cue type: " + cueType));
        }
    },

    speakModel(text) {
        if (!text || !this.synth) return;
        this.cancel();
        setTimeout(() => {
            this.isCancelling = false;
            const utterThis = new SpeechSynthesisUtterance(text);
            const selVoiceRadio = document.querySelector('input[name="ttsVoice"]:checked');
            const selVoiceType = selVoiceRadio ? selVoiceRadio.value : 'us_female';

            if (this.selectedVoices[selVoiceType]) {
                utterThis.voice = this.selectedVoices[selVoiceType];
                utterThis.lang = this.selectedVoices[selVoiceType].lang;
            } else {
                utterThis.lang = selVoiceType.startsWith('us') ? 'en-US' : 'en-GB';
            }
            utterThis.rate = this.rate;
            utterThis.pitch = 1.0;
            utterThis.onerror = (e) => {
                if(!this.isCancelling && this.errorElement){
                    this.errorElement.textContent = `TTS Error: ${e.error}`;
                    this.errorElement.classList.remove('hidden');
                }
            };
            this.synth.speak(utterThis);
        }, 150);
    }
};

// --- Common Elements / State ---
const builderTabButton = getElem('builderTabButton');
const playerTabButton = getElem('playerTabButton');
const builderTabContent = getElem('builderTabContent');
const drillTabContent = getElem('drillTabContent');

// --- Builder JS ---
const builderForm = getElem('drillBuilderForm');
const builderStatusMessage = getElem('statusMessage');
const builderRequireTypedInput = getElem('requireTypedInput');
const builderUseContractionsCheckbox = getElem('useContractions');

const verbEntriesContainer = getElem('verbEntriesContainer');
const addVerbEntryButton = getElem('addVerbEntryButton');
const premadeSetSelect = getElem('premadeSetSelect');
const loadPremadeSetButton = getElem('loadPremadeSetButton');
const appendPremadeSetCheckbox = getElem('appendPremadeSet');

let verbEntryCounter = 0;

function createVerbEntryElement(initialVerb = '', initialComplementsArray = []) {
    verbEntryCounter++;
    const entryDiv = document.createElement('div');
    entryDiv.className = 'verb-entry-block dark:bg-gray-700 dark:border-gray-600'; // Added dark classes
    entryDiv.dataset.entryId = verbEntryCounter;

    const verbInputGroup = document.createElement('div');
    verbInputGroup.className = 'word-input-group';
    const verbLabel = document.createElement('label');
    verbLabel.setAttribute('for', `verb_base_${verbEntryCounter}`);
    verbLabel.textContent = 'Verb (base form):';
    verbLabel.className = 'dark:text-gray-300'; // Added dark class
    const verbInput = document.createElement('input');
    verbInput.type = 'text';
    verbInput.id = `verb_base_${verbEntryCounter}`;
    verbInput.className = 'verb-input dark:bg-gray-600 dark:text-white dark:border-gray-500'; // Added dark classes
    verbInput.placeholder = 'e.g., eat, listen, go';
    verbInput.value = initialVerb;
    verbInput.required = true;
    verbInputGroup.appendChild(verbLabel);
    verbInputGroup.appendChild(verbInput);

    const complementsInputGroup = document.createElement('div');
    complementsInputGroup.className = 'word-input-group';
    const complementsLabel = document.createElement('label');
    complementsLabel.setAttribute('for', `verb_complements_${verbEntryCounter}`);
    complementsLabel.textContent = 'Complements for this verb (one per line; or blank for intransitive):';
    complementsLabel.className = 'dark:text-gray-300'; // Added dark class
    const complementsTextarea = document.createElement('textarea');
    complementsTextarea.id = `verb_complements_${verbEntryCounter}`;
    complementsTextarea.rows = 3;
    complementsTextarea.className = 'dark:bg-gray-600 dark:text-white dark:border-gray-500'; // Added dark class
    complementsTextarea.placeholder = 'e.g., pizza\nan apple\n(blank line for: He eats.)';
    complementsTextarea.value = initialComplementsArray.join('\n');
    complementsInputGroup.appendChild(complementsLabel);
    complementsInputGroup.appendChild(complementsTextarea);

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'remove-verb-button';
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => entryDiv.remove());

    entryDiv.appendChild(removeButton); 
    entryDiv.appendChild(verbInputGroup);
    entryDiv.appendChild(complementsInputGroup);

    if (verbEntriesContainer) verbEntriesContainer.appendChild(entryDiv);
    if (initialVerb === '') verbInput.focus(); 

    return entryDiv; 
}

function parseListFromTextarea(textareaElement) {
    if (!textareaElement || !textareaElement.value) return [];
    const text = textareaElement.value.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    return text.split('\n').map(item => item.trim());
}

function populatePremadeSetSelector() {
    if (!premadeSetSelect) return;
    premadeSetSelect.innerHTML = '<option value="">-- Select a pre-made set --</option>'; 
    for (const key in PREMADE_VERB_MODELS) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = PREMADE_VERB_MODELS[key].displayName;
        premadeSetSelect.appendChild(option);
    }
}

function handleLoadPremadeSet() {
    if (!premadeSetSelect || !premadeSetSelect.value || !verbEntriesContainer || !appendPremadeSetCheckbox) return;

    const selectedSetKey = premadeSetSelect.value;
    const modelsToLoad = PREMADE_VERB_MODELS[selectedSetKey]?.models;
    if (!modelsToLoad || modelsToLoad.length === 0) return;

    const shouldAppend = appendPremadeSetCheckbox.checked;

    if (!shouldAppend) {
        verbEntriesContainer.innerHTML = ''; 
    }

    const existingVerbBlocks = {};
    verbEntriesContainer.querySelectorAll('.verb-entry-block').forEach(block => {
        const verbInput = block.querySelector('input.verb-input');
        if (verbInput && verbInput.value.trim()) {
            existingVerbBlocks[verbInput.value.trim().toLowerCase()] = block;
        }
    });

    modelsToLoad.forEach(model => {
        const verbKey = model.verb.trim().toLowerCase();
        const complementToAdd = model.complement.trim();

        if (existingVerbBlocks[verbKey]) { 
            const existingBlock = existingVerbBlocks[verbKey];
            const complementsTextarea = existingBlock.querySelector('textarea');
            let currentComplementsText = complementsTextarea.value.trim();
            const existingLines = currentComplementsText.split('\n').map(l => l.trim()); 

            if (complementToAdd !== "") { 
                if (!existingLines.includes(complementToAdd)) {
                    complementsTextarea.value = (currentComplementsText === "" ? complementToAdd : currentComplementsText + '\n' + complementToAdd);
                }
            } else { 
                 const hasExplicitBlankLine = existingLines.includes("");
                 const isEffectivelyBlank = currentComplementsText === "";

                 if (!isEffectivelyBlank && !hasExplicitBlankLine) {
                     complementsTextarea.value += '\n'; 
                 }
            }
        } else { 
            const newBlock = createVerbEntryElement(model.verb, [complementToAdd]);
            existingVerbBlocks[verbKey] = newBlock; 
        }
    });
     premadeSetSelect.value = ""; 
}


if (builderForm) {
    builderForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!builderStatusMessage || !builderTabContent) return;
        builderStatusMessage.textContent = '';
        builderStatusMessage.className = 'status-message';

        try {
            const tenseRadio = builderTabContent.querySelector('input[name="tense"]:checked');
            const delayInput = builderTabContent.querySelector('#delaySeconds');
            const roundsInput = builderTabContent.querySelector('#numRounds');
            const auditoryCueRadio = builderTabContent.querySelector('input[name="auditoryCueType"]:checked');
            const subjectPronounsTextarea = getElem('subjectPronouns');

            if (!tenseRadio || !delayInput || !roundsInput || !builderRequireTypedInput ||
                !auditoryCueRadio || !builderUseContractionsCheckbox || !subjectPronounsTextarea) {
                throw new Error("One or more core form control elements are missing.");
            }

            const currentTense = tenseRadio.value;
            const subjectPronouns = parseListFromTextarea(subjectPronounsTextarea).filter(p => p !== '');

            if (subjectPronouns.length === 0) throw new Error("Subject Pronouns list cannot be empty.");

            const verbsData = {};
            const verbEntryBlocks = verbEntriesContainer ? verbEntriesContainer.querySelectorAll('.verb-entry-block') : [];

            if (verbEntryBlocks.length === 0) throw new Error("Please add at least one verb entry (custom or loaded).");

            verbEntryBlocks.forEach(block => {
                const verbInput = block.querySelector('input[type="text"].verb-input');
                const complementsTextarea = block.querySelector('textarea');
                if (verbInput && complementsTextarea) {
                    const verb = verbInput.value.trim().toLowerCase();
                    if (verb) {
                        let complements = parseListFromTextarea(complementsTextarea);
                        if (complements.length === 0) { 
                            complements = [''];
                        } else {
                            const allEmpty = complements.every(c => c === "");
                            if (allEmpty) { 
                                complements = [''];
                            } 
                        }
                        verbsData[verb] = { complements: complements };

                    } else if (block.querySelector('textarea').value.trim() !== '') {
                        throw new Error("An empty verb field was found in an entry that has complements. Please fill in all verb fields or remove the entry.");
                    }
                }
            });

            if (Object.keys(verbsData).length === 0) {
                 throw new Error("No valid verb entries found. Please ensure verbs are filled in for entries with complements, or add new entries.");
            }

            const config = {
                tense: currentTense,
                structureType: 'default_verb_structure',
                lists: { pronouns: subjectPronouns, verbs: verbsData },
                settings: {
                    allowedTypes: Array.from(builderTabContent.querySelectorAll('input[name="sentenceType"]:checked')).map(cb => cb.value),
                    delay: parseInt(delayInput.value, 10) * 1000,
                    rounds: parseInt(roundsInput.value, 10),
                    requireTypedInput: builderRequireTypedInput.checked,
                    auditoryCueType: auditoryCueRadio.value,
                    useContractions: builderUseContractionsCheckbox.checked
                }
            };
            if (config.settings.allowedTypes.length === 0) throw new Error("Please select at least one allowed sentence type.");
            if (isNaN(config.settings.delay) || config.settings.delay < 1000) throw new Error("Delay must be a number and at least 1 second.");
            if (isNaN(config.settings.rounds) || config.settings.rounds < 1) throw new Error("Number of rounds must be a number and at least 1.");

            localStorage.setItem('drillConfig', JSON.stringify(config));
            builderStatusMessage.textContent = 'Configuration saved! Switch to the "Drill Player" tab.';
            builderStatusMessage.className = 'status-message status-success';

        } catch (error) {
            builderStatusMessage.textContent = `Error saving: ${error.message}`;
            builderStatusMessage.className = 'status-message status-error';
            console.error("Error saving config:", error);
        }
    });
}

if (addVerbEntryButton) addVerbEntryButton.addEventListener('click', () => createVerbEntryElement());
if (loadPremadeSetButton) loadPremadeSetButton.addEventListener('click', handleLoadPremadeSet);

// --- Player JS ---
const playerLevelIndicator = getElem('levelIndicator');
const playerAudioCueStatus = getElem('audioCueStatus');
const playerPromptPronoun = getElem('promptPronoun');
const playerPromptVerb = getElem('promptVerb');
const playerPromptType = getElem('promptType');
const playerPromptComplement = getElem('promptComplement');
const playerCorrectAnswerDisplay = getElem('correctAnswerDisplay');
const playerStartButton = getElem('startButton');
const playerPauseDrillButton = getElem('pauseDrillButton');
const playerNextRoundButton = getElem('nextRoundButton');
const playerErrorMessage = getElem('errorMessage');
const playerStudentInputArea = getElem('studentInputArea');
const playerStudentAnswerInput = getElem('studentAnswerInput');
const playerSubmitAnswerButton = getElem('submitAnswerButton');
const playerTypedAnswerFeedback = getElem('typedAnswerFeedback');
const modelListeningArea = getElem('modelListeningArea', false);
const listenModelButton = getElem('listenModelButton', false);

let playerConfig = null;
let playerCurrentRound = 0;
let playerTotalRounds = 0;
let playerCurrentCorrectAnswer = '';
let playerStudentAttemptTimeoutId = null;
let playerNextRoundTimerId = null;
let playerIsRunning = false;
let playerIsPaused = false;
let sessionHistory = [];

const summaryView = getElem('summaryView');
const sessionRecapList = getElem('sessionRecapList');
const playAgainButton = getElem('playAgainButton');

function playerGetRandomElement(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

const countdownContainer = getElem('countdownContainer');
const countdownBar = getElem('countdownBar');

function resetProgressBar() {
    if (countdownContainer && countdownBar) {
        countdownContainer.classList.remove('hidden');
        countdownBar.style.transition = 'none';
        countdownBar.style.width = '100%';
    }
}

function startProgressBar(durationMs) {
    if (countdownContainer && countdownBar) {
        // Force reflow to ensure the reset (100% width) is applied before transition starts
        void countdownBar.offsetWidth; 
        countdownBar.style.transition = `width ${durationMs}ms linear`;
        countdownBar.style.width = '0%';
    }
}

function promptStudentToSpeak() {
    if (playerIsPaused || DrillAudio.isCancelling) return; 
    if (playerAudioCueStatus) playerAudioCueStatus.textContent = "Your turn to speak!";
    
    // Start Visual Countdown
    resetProgressBar();
    startProgressBar(playerConfig.settings.delay);

    clearTimeout(playerStudentAttemptTimeoutId);
    playerStudentAttemptTimeoutId = setTimeout(() => {
        if (playerIsRunning && !playerIsPaused) { 
            revealFullAnswerAndModel();
        }
    }, playerConfig.settings.delay);
}

function highlightGrammar(sentence, type) {
    if (!sentence) return '';
    
    // Safety escape for HTML to prevent injection if sentence comes from untrusted source (though here it's internal)
    const escapeHtml = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safeSentence = escapeHtml(sentence);
    const highlightClass = "font-bold text-indigo-600";

    // Helper regex to match whole words
    const w = (str) => `\\b${str}\\b`;

    if (type === SENTENCE_TYPE_NEGATIVE) {
        // Match: don't/doesn't/didn't/do not/does not/did not + optional whitespace + verb
        // Note: This regex is a heuristic. It looks for the aux + verb pattern.
        return safeSentence.replace(
            /((?:do|does|did)\s*not|don't|doesn't|didn't)(\s+)(\w+)/gi, 
            `<span class="${highlightClass}">$1$2$3</span>`
        );
    } else if (type === SENTENCE_TYPE_INTERROGATIVE) {
        // Match: Do/Does/Did + subject + verb. This is trickier as subject varies.
        // Heuristic: Match "Do/Does/Did" at start, then capturing up to the next verb-like word? 
        // Better: Just highlight the Auxiliary "Do/Does/Did" and the main verb if we can identify it.
        // Simple V1: Highlight "Do/Does/Did".
        // Improved V1: Highlight "Do/Does/Did ... verb".
        // Given we build the sentence as Aux + Subject + Verb, we can try to reconstruct this specific highlight 
        // if we had the components. Since we only have the final string here, regex is hard.
        // Let's rely on highlighting the Aux and keeping it simple for stability, or specific patterns.
        
        return safeSentence.replace(
            /^(Do|Does|Did)(\s+)(I|You|He|She|It|We|They)(\s+)(\w+)/i,
            `<span class="${highlightClass}">$1</span>$2$3$4<span class="${highlightClass}">$5</span>`
        );
    } else {
        // Affirmative: Highlight verbs ending in s/es/ies for 3rd person, or just the verb.
        // Hard to distinguish verb from subject/object without NLP.
        // However, we know the structure is Subject + Verb + ...
        // We can look for the second word (usually verb) if subject is single word.
        // A safer bet for now is highlighting 3rd person conjugations which are distinct.
        return safeSentence.replace(
            /\b(\w+(?:s|es|ies))\b/g,
            (match) => {
                // Filter out common non-verbs if possible, but 'plays', 'goes' are safe. 
                // 'is', 'has' are also good.
                if (['always', 'sometimes', 'bus', 'class'].includes(match.toLowerCase())) return match;
                return `<span class="${highlightClass}">${match}</span>`;
            }
        );
    }
}

function revealFullAnswerAndModel() {
    if (playerIsPaused) return; 
    clearTimeout(playerStudentAttemptTimeoutId);

    if (playerCorrectAnswerDisplay) {
        // Determine the type for highlighting based on the sentence content or passing state
        // We don't have 'type' readily available here as a local var, but we can infer or pass it globally.
        // Ideally playerCurrentRound data should be stored.
        // For this implementation, let's look at punctuation/content.
        let type = SENTENCE_TYPE_AFFIRMATIVE;
        if (playerCurrentCorrectAnswer.includes('?')) type = SENTENCE_TYPE_INTERROGATIVE;
        else if (playerCurrentCorrectAnswer.match(/n't|not/)) type = SENTENCE_TYPE_NEGATIVE;

        playerCorrectAnswerDisplay.innerHTML = highlightGrammar(playerCurrentCorrectAnswer, type);
        playerCorrectAnswerDisplay.classList.remove('hidden');
        setTimeout(() => playerCorrectAnswerDisplay.classList.add('visible'), 30); 
    }
    if (modelListeningArea) {
        modelListeningArea.classList.remove('hidden');
        if(listenModelButton) listenModelButton.disabled = false;
    }
    if (DrillAudio.errorElement) DrillAudio.errorElement.classList.add('hidden');

    clearTimeout(playerNextRoundTimerId);
    if (playerNextRoundButton) playerNextRoundButton.classList.remove('hidden');

    const autoAdvanceDelay = (playerConfig.settings.delay || 7000) + 3000; 
    playerNextRoundTimerId = setTimeout(() => {
        if (playerIsRunning && !playerIsPaused) { 
            playerNextRound();
        }
    }, autoAdvanceDelay);

    if (playerConfig.settings.requireTypedInput && playerStudentInputArea) {
        playerStudentInputArea.classList.remove('hidden');
        if (playerStudentAnswerInput) {
            playerStudentAnswerInput.value = ''; 
            playerStudentAnswerInput.disabled = false;
            playerStudentAnswerInput.focus();
        }
        if (playerSubmitAnswerButton) playerSubmitAnswerButton.disabled = false;
        if (playerTypedAnswerFeedback) {
            playerTypedAnswerFeedback.textContent = '';
            playerTypedAnswerFeedback.className = 'typedAnswerFeedback mt-3 min-h-[1.5rem]'; 
        }
    }
}

function normalizeForComparison(text) {
    return typeof text !== 'string' ? '' : text.toLowerCase().trim().replace(/[.,!?']/g, '').replace(/\s+/g, ' ');
}


function checkStudentAnswer() {
    if (!playerConfig || !playerConfig.settings.requireTypedInput ||
        !playerStudentAnswerInput || playerStudentAnswerInput.disabled ||
        !playerTypedAnswerFeedback || !playerSubmitAnswerButton) return;

    playerStudentAnswerInput.disabled = true;
    playerSubmitAnswerButton.disabled = true;

    const studentAnswerNormalized = normalizeForComparison(playerStudentAnswerInput.value);
    const correctAnswerNormalized = normalizeForComparison(playerCurrentCorrectAnswer);

    playerTypedAnswerFeedback.className = 'typedAnswerFeedback mt-3 min-h-[1.5rem]'; 
    if (studentAnswerNormalized === correctAnswerNormalized) {
        playerTypedAnswerFeedback.textContent = 'Typed answer is Correct!';
        playerTypedAnswerFeedback.classList.add('feedback-correct');
    } else {
        playerTypedAnswerFeedback.textContent = `Your typed answer was not an exact match.`;
        playerTypedAnswerFeedback.classList.add('feedback-incorrect');
    }
}

function conjugatePresentSimpleVerb(baseVerb, pronoun) {
    if (!baseVerb || !pronoun) return baseVerb;
    const lowerPronoun = pronoun.toLowerCase();
    const verbLower = baseVerb.toLowerCase();

    if (['i', 'you', 'we', 'they'].includes(lowerPronoun)) {
        return baseVerb;
    } else if (['he', 'she', 'it'].includes(lowerPronoun)) {
        if (verbLower === 'have') return 'has';
        if (verbLower.match(/([sxz]|ch|sh|o)$/)) return baseVerb + 'es';
        if (verbLower.match(/[^aeiou]y$/)) return baseVerb.slice(0, -1) + 'ies';
        return baseVerb + 's';
    }
    return baseVerb; 
}

function playerBuildSentence(pronoun, verb, complement, sentenceType, tense, settings) {
    if (!pronoun || !verb || !sentenceType || !tense || !settings) return "Error: Sentence generation failed.";

    let subject = pronoun.charAt(0).toUpperCase() + pronoun.slice(1);
    if (pronoun.toLowerCase() === 'i') subject = "I";

    let sentence = '';
    const lowerPronoun = pronoun.toLowerCase();
    const useContractions = settings.useContractions;
    const complementPart = (complement && complement.trim() !== '') ? ` ${complement.trim()}` : '';

    if (tense === TENSE_SIMPLE_PRESENT) {
        switch (sentenceType) {
            case SENTENCE_TYPE_AFFIRMATIVE:
                sentence = `${subject} ${conjugatePresentSimpleVerb(verb, lowerPronoun)}${complementPart}.`;
                break;
            case SENTENCE_TYPE_NEGATIVE:
                let auxNeg = (['he', 'she', 'it'].includes(lowerPronoun)) ?
                             (useContractions ? "doesn't" : "does not") :
                             (useContractions ? "don't" : "do not");
                sentence = `${subject} ${auxNeg} ${verb}${complementPart}.`;
                break;
            case SENTENCE_TYPE_INTERROGATIVE:
                let auxInt = (['he', 'she', 'it'].includes(lowerPronoun)) ? "Does" : "Do";
                sentence = `${auxInt} ${(lowerPronoun === 'i' ? "I" : lowerPronoun)} ${verb}${complementPart}?`;
                break;
            default:
                sentence = 'Error: Unknown sentence type.';
        }
    } else if (tense === TENSE_SIMPLE_PAST) {
        sentence = `${subject} ${verb}${complementPart}. (Past Simple Placeholder)`;
    } else {
        sentence = 'Error: Unknown tense.';
    }
    return sentence;
}

function updatePlayerPrompts(pronoun, verb, type, complement) {
    if (playerPromptPronoun) {
        playerPromptPronoun.textContent = pronoun.charAt(0).toUpperCase() + pronoun.slice(1);
        playerPromptPronoun.classList.remove('hidden');
    }
    if (playerPromptVerb) {
        playerPromptVerb.textContent = `(${verb})`;
        playerPromptVerb.classList.remove('hidden');
    }
    if (playerPromptType) {
        let typeText = type.charAt(0).toUpperCase() + type.slice(1);
        if (typeText === 'Interrogative') typeText = 'Question';
        playerPromptType.textContent = `(${typeText})`;
        playerPromptType.classList.remove('hidden');
    }
    if (playerPromptComplement) {
        if (complement && complement.trim() !== '') {
            playerPromptComplement.textContent = complement.trim();
            playerPromptComplement.classList.remove('hidden');
        } else {
            playerPromptComplement.textContent = '';
            playerPromptComplement.classList.add('hidden');
        }
    }
}

function playerNextRound() {
    if (playerIsPaused) return;
    DrillAudio.cancel(); 
    clearTimeout(playerStudentAttemptTimeoutId);
    clearTimeout(playerNextRoundTimerId);

    // Hide countdown between rounds
    if (countdownContainer) countdownContainer.classList.add('hidden');

    if (playerNextRoundButton) playerNextRoundButton.classList.add('hidden');
    if (playerStudentInputArea) playerStudentInputArea.classList.add('hidden');
    if (playerTypedAnswerFeedback) {
        playerTypedAnswerFeedback.textContent = '';
        playerTypedAnswerFeedback.className = 'typedAnswerFeedback mt-3 min-h-[1.5rem]';
    }
    if (modelListeningArea) modelListeningArea.classList.add('hidden');

    if (!playerConfig || !playerIsRunning || playerCurrentRound >= playerTotalRounds) {
        playerEndGame();
        return;
    }

    playerCurrentRound++;

    const randomPronoun = playerGetRandomElement(playerConfig.lists.pronouns);
    const availableVerbKeys = Object.keys(playerConfig.lists.verbs);
    if (availableVerbKeys.length === 0) {
        if(playerErrorMessage) playerErrorMessage.textContent = "Error: No verbs available in configuration.";
        playerEndGame(); return;
    }
    const randomVerbKey = playerGetRandomElement(availableVerbKeys);
    const verbData = playerConfig.lists.verbs[randomVerbKey];

    if (!verbData || !verbData.complements || verbData.complements.length === 0) {
        if(playerErrorMessage) playerErrorMessage.textContent = `Error: Complements missing or empty for verb '${randomVerbKey}'.`;
        playerEndGame(); return;
    }
    const randomComplement = playerGetRandomElement(verbData.complements); 
    const randomType = playerGetRandomElement(playerConfig.settings.allowedTypes);

    if (!randomPronoun || !randomVerbKey || !randomType) {
        if(playerErrorMessage) playerErrorMessage.textContent = "Error generating prompts from configuration.";
        playerEndGame(); return;
    }

    playerCurrentCorrectAnswer = playerBuildSentence(randomPronoun, randomVerbKey, randomComplement, randomType, playerConfig.tense, playerConfig.settings);
    
    // Add to history
    sessionHistory.push(playerCurrentCorrectAnswer);

    if(playerLevelIndicator) playerLevelIndicator.textContent = `Round ${playerCurrentRound}/${playerTotalRounds}`;
    updatePlayerPrompts(randomPronoun, randomVerbKey, randomType, randomComplement);

    if(playerCorrectAnswerDisplay) {
        playerCorrectAnswerDisplay.classList.add('hidden');
        playerCorrectAnswerDisplay.classList.remove('visible');
        playerCorrectAnswerDisplay.textContent = '';
    }
    if (DrillAudio.errorElement) DrillAudio.errorElement.classList.add('hidden');

    DrillAudio.playCue(randomPronoun, randomComplement, randomType, playerConfig.tense, playerConfig.structureType, playerConfig.settings.auditoryCueType || 'full_gap', (err) => {
        if (err && err.message !== "cancelled" && err.message !== "cancelled_or_paused") {
            if(playerAudioCueStatus) playerAudioCueStatus.textContent = "Error with audio cue.";
            console.error("Audio cue error:", err);
            setTimeout(revealFullAnswerAndModel, 500);
        } else if (!playerIsPaused && (!err || (err.message !== "cancelled" && err.message !== "cancelled_or_paused"))) {
            promptStudentToSpeak();
        }
    });
}

function playerStartGame() {
    if (playerIsRunning || !playerConfig || !playerStartButton || !playerErrorMessage) return;

    playerIsRunning = true;
    playerIsPaused = false;
    sessionHistory = []; // Reset history

    if(summaryView) summaryView.classList.add('hidden'); // Hide summary if visible
    if(playerStartButton) {
      playerStartButton.disabled = true;
      playerStartButton.textContent = 'Running...';
    }
    if (playerPauseDrillButton) playerPauseDrillButton.classList.remove('hidden');
    if (playerNextRoundButton) playerNextRoundButton.classList.add('hidden');
    if(playerErrorMessage) playerErrorMessage.textContent = '';

    if (!playerConfig.lists.pronouns || playerConfig.lists.pronouns.length === 0) {
        if(playerErrorMessage) playerErrorMessage.textContent = `Error: Pronouns list empty. Please check Builder.`;
        playerIsRunning = false; if(playerStartButton) playerStartButton.disabled = false; return;
    }
    if (!playerConfig.lists.verbs || Object.keys(playerConfig.lists.verbs).length === 0) {
        if(playerErrorMessage) playerErrorMessage.textContent = `Error: No verbs defined. Please check Builder.`;
        playerIsRunning = false; if(playerStartButton) playerStartButton.disabled = false; return;
    }

    playerCurrentRound = 0;
    playerTotalRounds = playerConfig.settings.rounds;

    clearTimeout(playerStudentAttemptTimeoutId);
    clearTimeout(playerNextRoundTimerId);

    if (playerCorrectAnswerDisplay) { playerCorrectAnswerDisplay.classList.add('hidden'); playerCorrectAnswerDisplay.classList.remove('visible'); playerCorrectAnswerDisplay.textContent = ''; }
    if (playerTypedAnswerFeedback) { playerTypedAnswerFeedback.textContent = ''; playerTypedAnswerFeedback.className = 'typedAnswerFeedback mt-3 min-h-[1.5rem]'; }
    if (modelListeningArea) modelListeningArea.classList.add('hidden');

    playerNextRound();
}

function renderSessionSummary() {
    if (!summaryView || !sessionRecapList) return;

    // Hide active game elements
    if (playerLevelIndicator) playerLevelIndicator.textContent = "";
    if (playerStartButton) playerStartButton.classList.add('hidden'); // Hide start button container or button itself? Parent is better but button is easier.
    // Actually playerStartButton is usually visible to restart. But we have a specific Play Again in summary.
    // Let's hide the main start button to avoid confusion, or keep it. 
    // The previous endGame logic showed it.
    // Let's hide the prompts and inputs (already done in endGame).
    
    // Populate list
    sessionRecapList.innerHTML = '';
    sessionHistory.forEach(sentence => {
        const li = document.createElement('li');
        li.className = "border-b border-gray-100 last:border-0 py-2 text-gray-700";
        li.textContent = sentence;
        sessionRecapList.appendChild(li);
    });

    summaryView.classList.remove('hidden');
}

function playerEndGame() {
    playerIsRunning = false;
    playerIsPaused = false;
    clearTimeout(playerStudentAttemptTimeoutId);
    clearTimeout(playerNextRoundTimerId);
    DrillAudio.cancel();

    if (countdownContainer) countdownContainer.classList.add('hidden');

    // Clear prompts
    if(playerPromptPronoun) playerPromptPronoun.classList.add('hidden');
    if(playerPromptVerb) playerPromptVerb.classList.add('hidden');
    if(playerPromptType) playerPromptType.classList.add('hidden');
    if(playerPromptComplement) playerPromptComplement.classList.add('hidden');

    if (modelListeningArea) modelListeningArea.classList.add('hidden');
    if (playerCorrectAnswerDisplay) playerCorrectAnswerDisplay.classList.add('hidden'); // Hide last answer

    if(playerStartButton){
        playerStartButton.disabled = false;
        playerStartButton.textContent = 'Start Drill Again';
        playerStartButton.classList.add('hidden'); // Hide main start button in favor of summary
    }
    if(playerPauseDrillButton) {
        playerPauseDrillButton.classList.add('hidden');
        playerPauseDrillButton.textContent = 'Pause Drill'; 
    }
    if(playerNextRoundButton) playerNextRoundButton.classList.add('hidden');
    if(playerStudentInputArea) playerStudentInputArea.classList.add('hidden');

    renderSessionSummary();
}

function validatePlayerConfig(config) {
    if (!config || typeof config !== 'object') throw new Error("Configuration is missing or invalid.");
    if (!config.tense || ![TENSE_SIMPLE_PRESENT, TENSE_SIMPLE_PAST].includes(config.tense)) throw new Error(`Invalid tense ('${config.tense}'). Check Builder.`);
    if (config.structureType !== 'default_verb_structure') throw new Error("Invalid structureType. Check Builder.");

    if (!config.lists || typeof config.lists !== 'object') throw new Error("Word lists object missing. Check Builder.");
    if(!Array.isArray(config.lists.pronouns) || config.lists.pronouns.length === 0) throw new Error(`Pronouns list missing or empty. Check Builder.`);
    if (typeof config.lists.verbs !== 'object' || config.lists.verbs === null || Object.keys(config.lists.verbs).length === 0) throw new Error(`Verb data missing or empty. Check Builder.`);

    for (const verb in config.lists.verbs) {
        if (!config.lists.verbs[verb].hasOwnProperty('complements') || !Array.isArray(config.lists.verbs[verb].complements)) {
            throw new Error(`Complements data invalid for verb '${verb}'. Check Builder.`);
        }
        if (config.lists.verbs[verb].complements.length === 0) {
            console.warn(`Complements array for verb '${verb}' was empty. Normalizing to [''].`);
            config.lists.verbs[verb].complements = [''];
        }
    }

    if (!config.settings || typeof config.settings !== 'object') throw new Error("Settings missing. Check Builder.");
    if (!Array.isArray(config.settings.allowedTypes) || config.settings.allowedTypes.length === 0) throw new Error("Allowed sentence types missing. Check Builder.");
    return true;
}

function loadConfigurationForPlayer() {
    if (!playerLevelIndicator || !playerErrorMessage || !playerStartButton) return;

    playerLevelIndicator.textContent = "Loading Configuration...";
    playerErrorMessage.textContent = '';
    playerStartButton.disabled = true;

    try {
        const savedConfig = localStorage.getItem('drillConfig');
        if (savedConfig) {
            playerConfig = JSON.parse(savedConfig);
            validatePlayerConfig(playerConfig); 

            const tenseName = playerConfig.tense.replace(/_/g,' ').replace(/\b\w/g, l => l.toUpperCase()); 
            playerLevelIndicator.textContent = `Drill Ready (Tense: ${tenseName}). Press Start.`;
            playerStartButton.disabled = false;

            if (playerIsRunning) {
                playerEndGame();
                 playerLevelIndicator.textContent = `Drill Ready (Tense: ${tenseName}). Press Start.`; 
            }
        } else {
            playerLevelIndicator.textContent = "No drill configuration found.";
            playerErrorMessage.textContent = "Please configure and save a drill in the 'Builder' tab first.";
            playerConfig = null;
        }
    } catch (error) {
        console.error("Player config load/validation error:", error);
        playerLevelIndicator.textContent = "Error loading configuration.";
        playerErrorMessage.textContent = `Configuration error: ${error.message}`;
        playerConfig = null;
    }

    if (!playerConfig || playerErrorMessage.textContent) {
        if(playerStartButton) playerStartButton.disabled = true;
        if (playerIsRunning) playerEndGame(); 
    }
}


// --- Event Listeners & Initial Setup ---
document.addEventListener('DOMContentLoaded', () => {
    DrillAudio.init();

    if (builderTabButton && playerTabButton && builderTabContent && drillTabContent) {
        switchTab('builderTabContent'); 
        if (addVerbEntryButton) createVerbEntryElement(); 
        populatePremadeSetSelector();
    } else {
        console.error("Initial setup failed: Core tab elements missing.");
        return;
    }

    if (builderTabButton) builderTabButton.addEventListener('click', () => switchTab('builderTabContent'));
    if (playerTabButton) playerTabButton.addEventListener('click', () => switchTab('drillTabContent'));

    if (playerStartButton) playerStartButton.addEventListener('click', playerStartGame);
    if (playAgainButton) {
        playAgainButton.addEventListener('click', () => {
            if(playerStartButton) playerStartButton.classList.remove('hidden'); // Restore main button for next time
            playerStartGame();
        });
    }

    if (playerSubmitAnswerButton) {
        playerSubmitAnswerButton.addEventListener('click', checkStudentAnswer);
    }
    if (playerStudentAnswerInput) {
        playerStudentAnswerInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); 
                if (playerSubmitAnswerButton && !playerSubmitAnswerButton.disabled) {
                    checkStudentAnswer();
                }
            }
        });
    }

    if (playerNextRoundButton) playerNextRoundButton.addEventListener('click', () => {
        if (playerIsRunning && !playerIsPaused) playerNextRound();
    });

    if (playerPauseDrillButton) playerPauseDrillButton.addEventListener('click', () => {
        if (!playerIsRunning) return;
        playerIsPaused = !playerIsPaused;
        if (playerIsPaused) {
            playerPauseDrillButton.textContent = 'Resume Drill';
            clearTimeout(playerStudentAttemptTimeoutId);
            clearTimeout(playerNextRoundTimerId);
            DrillAudio.cancel();
            
            // Pause visuals
            if (countdownBar) {
                const currentWidth = getComputedStyle(countdownBar).width;
                countdownBar.style.transition = 'none';
                countdownBar.style.width = currentWidth; // Freeze in place
            }
            if(playerAudioCueStatus) playerAudioCueStatus.textContent = 'Drill Paused.';
        } else {
            playerPauseDrillButton.textContent = 'Pause Drill';
            if (playerAudioCueStatus) playerAudioCueStatus.textContent = ''; 

            if (playerCorrectAnswerDisplay && playerCorrectAnswerDisplay.classList.contains('visible')) {
                const autoAdvanceDelay = (playerConfig.settings.delay || 7000) + 3000;
                playerNextRoundTimerId = setTimeout(() => {
                    if (playerIsRunning && !playerIsPaused) playerNextRound();
                }, autoAdvanceDelay);
                if (playerConfig.settings.requireTypedInput && playerStudentInputArea &&
                    !playerStudentInputArea.classList.contains('hidden') && playerStudentAnswerInput) {
                    playerStudentAnswerInput.focus();
                }
            } else {
                promptStudentToSpeak();
            }
        }
    });

    if (listenModelButton) listenModelButton.addEventListener('click', () => DrillAudio.speakModel(playerCurrentCorrectAnswer));

    // --- Dark Mode Logic ---
    const darkModeToggle = getElem('darkModeToggle');
    const htmlEl = document.documentElement;
    
    // Check saved preference
    if (localStorage.getItem('darkMode') === 'true' || 
        (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlEl.classList.add('dark');
        if(darkModeToggle) darkModeToggle.textContent = '🌙';
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            htmlEl.classList.toggle('dark');
            const isDark = htmlEl.classList.contains('dark');
            localStorage.setItem('darkMode', isDark);
            darkModeToggle.textContent = isDark ? '🌙' : '☀️';
        });
    }

});

function switchTab(targetId) {
    if (!builderTabButton || !playerTabButton || !builderTabContent || !drillTabContent) return;

    const isActiveBuilder = targetId === 'builderTabContent';

    builderTabButton.classList.toggle('active', isActiveBuilder);
    playerTabButton.classList.toggle('active', !isActiveBuilder);

    builderTabContent.classList.toggle('hidden', !isActiveBuilder);
    drillTabContent.classList.toggle('hidden', isActiveBuilder);

    if (playerIsRunning && isActiveBuilder) { 
        playerEndGame(); 
    }

    if (!isActiveBuilder) { 
        loadConfigurationForPlayer();
    } else { 
        DrillAudio.cancel(); 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    class StoryStarter {
        constructor(manager) {
            this.mgr = manager;
            this.storyPrompt = document.getElementById('story-prompt');
            this.storyOutput = document.getElementById('story-output').querySelector('p');
            this.generateStoryBtn = document.getElementById('generate-story-btn');
            this.apiKeyModal = document.getElementById('api-key-modal');
            this.apiKeyInput = document.getElementById('api-key-input');
            this.saveApiKeyBtn = document.getElementById('save-api-key-btn');
            this.apiKey = localStorage.getItem('gemini-api-key') || '';

            if (this.generateStoryBtn) this.generateStoryBtn.addEventListener('click', () => this.handleGenerate());
            if (this.saveApiKeyBtn) this.saveApiKeyBtn.addEventListener('click', () => this.saveApiKey());
        }

        showApiKeyModal() { if (this.apiKeyModal) { this.apiKeyModal.classList.remove('hidden'); this.apiKeyModal.classList.add('flex'); } }
        hideApiKeyModal() { if (this.apiKeyModal) { this.apiKeyModal.classList.add('hidden'); this.apiKeyModal.classList.remove('flex'); } }

        saveApiKey() {
            const key = this.apiKeyInput.value.trim();
            if (key) {
                this.apiKey = key;
                localStorage.setItem('gemini-api-key', key);
                this.hideApiKeyModal();
                this.handleGenerate();
            } else { alert("Please enter a valid API key."); }
        }

        async callGemini(modelName, prompt) {
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${this.apiKey}`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error?.message || `Error ${response.status}`);
            return result.candidates[0].content.parts[0].text;
        }

        async handleGenerate() {
            if (!this.apiKey) { this.showApiKeyModal(); return; }
            const userPrompt = this.storyPrompt.value.trim();
            if (!userPrompt) { this.mgr.speak("Please enter a prompt."); return; }

            this.storyOutput.textContent = 'Contacting the Magic Wizards... 🪄';
            this.generateStoryBtn.disabled = true;
            this.mgr.setCharacterExpression('thinking');

            const finalPrompt = `Write a short, fun, and educational story for a child based on this: ${userPrompt}. Keep it under 150 words.`;

            try {
                let text;
                try {
                    // Try Model 1: Flash
                    text = await this.callGemini('gemini-1.5-flash', finalPrompt);
                } catch (e) {
                    console.warn("Flash failed, trying Pro...", e);
                    // Try Model 2: Pro
                    text = await this.callGemini('gemini-pro', finalPrompt);
                }

                this.storyOutput.textContent = text;
                this.mgr.setCharacterExpression('happy');
                this.mgr.speak("I have a story for you!");
                this.mgr.addScore(2);

            } catch (error) {
                console.error('Final AI Error:', error);
                this.storyOutput.innerHTML = `<span class="text-red-500 font-bold">⚠️ Connection Error:</span><br>${error.message}<br><br><small>Tip: Make sure your API key is correct and you have an active internet connection.</small>`;
                this.mgr.setCharacterExpression('sad');
            } finally {
                this.generateStoryBtn.disabled = false;
            }
        }
    }
    new StoryStarter(window.gameManager);
});
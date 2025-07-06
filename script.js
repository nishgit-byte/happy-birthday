document.addEventListener('DOMContentLoaded', () => {

    // --- SETUP FOR ALL PAGE ELEMENTS ---
    const scenes = document.querySelectorAll('.scene');
    const collageScene = document.querySelector('#collage-scene');
    const finaleScene = document.querySelector('#finale-scene');
    const chapter6 = document.querySelector('#chapter6');
    const chapter2 = document.getElementById('chapter2');
    let currentSceneIndex = -1;

    // --- MAIN SCROLL LISTENER ---
    window.addEventListener('scroll', () => {
        handleFadingScenes();
        handleCollageScroll();
        // handleFinaleChapter();
    });
    
    // --- Logic for the Interactive Envelope ---
    const envelopeWrapper = document.querySelector('.envelope-wrapper');
    if (envelopeWrapper) {
        envelopeWrapper.addEventListener('click', () => {
            envelopeWrapper.classList.add('opened');
        }, { once: true });
    }
    
    // --- FUNCTION DEFINITIONS ---

    // FUNCTION 1: Handles all simple fading text scenes and outro buffers
    function handleFadingScenes() {
        const viewportMid = window.scrollY + window.innerHeight / 2;
        let newSceneIndex = -1;
    
        scenes.forEach((scene, index) => {
            const rect = scene.getBoundingClientRect();
            const sceneTop = window.scrollY + rect.top;
            const sceneBottom = window.scrollY + rect.bottom;
    
            if (viewportMid >= sceneTop && viewportMid < sceneBottom) {
                newSceneIndex = index;
            }
        });
    
        if (newSceneIndex !== -1 && newSceneIndex !== currentSceneIndex) {
            currentSceneIndex = newSceneIndex;
    
            scenes.forEach((scene, i) => {
                scene.classList.toggle('active', i === currentSceneIndex);
            });
    
            if (scenes[currentSceneIndex] && scenes[currentSceneIndex].id === 'scene5') {
                confetti({ particleCount: 150, angle: 60, spread: 80, origin: { x: 0, y: 0.7 } });
                confetti({ particleCount: 150, angle: 120, spread: 80, origin: { x: 1, y: 0.7 } });
            }
        }
    }

    

    const observer = new IntersectionObserver(
    ([entry]) => {
        if (entry.isIntersecting) {
        chapter2.classList.add('active');
        } else {
        chapter2.classList.remove('active');
        }
    },
    {
        threshold: 0.1,
    }
    );

    observer.observe(chapter2);

    
    

    // FUNCTION 2: The Collage Animation Logic
    function handleCollageScroll() {
        if (!collageScene) return;
        const finalText = document.querySelector('#final-text');
        const collageContainer = document.querySelector('#collage-container');
        const collageBlocks = document.querySelectorAll('.collage-block');
        const rect = collageScene.getBoundingClientRect();
        if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
            const scrollableHeight = collageScene.scrollHeight - window.innerHeight;
            const progress = Math.max(0, Math.min(1, -rect.top / scrollableHeight));
            const thresholds = [0.05, 0.15, 0.23, 0.31, 0.40, 0.50, 0.62, 0.74, 0.86, 0.95];
            thresholds.forEach((threshold, index) => {
                if (progress >= threshold) {
                    collageBlocks[index].classList.add('visible');
                } else {
                    collageBlocks[index].classList.remove('visible');
                }
            });
            const fadeStart = 0.90;
            if (progress >= fadeStart) {
                const relativeProgress = (progress - fadeStart) / (1 - fadeStart);
                collageContainer.style.opacity = Math.max(0, 1 - relativeProgress);
                finalText.style.opacity = Math.min(1, relativeProgress);
            } else {
                collageContainer.style.opacity = 1;
                finalText.style.opacity = 0;
            }
        } else if (rect.top > 0) {
            collageContainer.style.opacity = 1;
            finalText.style.opacity = 0;
            collageBlocks.forEach(block => block.classList.remove('visible'));
        } else {
            collageContainer.style.opacity = 0;
            finalText.style.opacity = 1;
        }
    }
    function handleNewChapter6() {
        const chapter6 = document.getElementById('chapter6');
        const loveTextContainer = document.querySelector('.love-text-container');
        const loveText = document.querySelector('.love-text');
        const reasonsContainer = document.querySelector('.reasons-text-container');
        
        if (!chapter6 || !loveText || !reasonsContainer) return;
        
        const rect = chapter6.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const chapterStart = chapter6.offsetTop;
        const chapterHeight = chapter6.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Calculate progress through the chapter (0 to 1)
        const progress = Math.max(0, Math.min(1, (scrollTop - chapterStart) / (chapterHeight - windowHeight)));
        
        console.log('Chapter 6 Progress:', progress);
        
        // Phase 1: Love text visible and scaling (0 to 0.5)
        if (progress <= 0.5) {
            // Show love text
            loveText.style.opacity = '1';
            loveText.style.transform = `scale(${1 + progress * 2})`; // Scale from 1 to 2
            
            // Hide reasons
            reasonsContainer.classList.add('hidden');
        }
        // Phase 2: Transition and show reasons (0.5 to 1)
        else {
            // Hide love text
            loveText.style.opacity = '0';
            loveText.style.transform = 'scale(3)';
            
            // Show reasons with fade in
            reasonsContainer.classList.remove('hidden');
            
            // Optional: Add some entrance animation
            const reasonsProgress = (progress - 0.5) / 0.5; // 0 to 1 for second half
            reasonsContainer.style.transform = `translateY(${(1 - reasonsProgress) * 50}px)`;
        }
    }
    
    // Add to your main scroll listener
    window.addEventListener('scroll', handleNewChapter6);
    
    // Also call once on load
    document.addEventListener('DOMContentLoaded', handleNewChapter6);
    // FUNCTION 3: The FINAL, REBUILT Finale Chapter Logic
    // function handleFinaleChapter() {
    //     if (!finaleScene || !chapter6) return;

    //     const loveYouText = document.querySelector('#love-you-text');
    //     const reasonsContainer = document.querySelector('#reasons-container');
    //     const chapterRect = chapter6.getBoundingClientRect();
        
    //     // Exit early if the chapter isn't on screen at all
    //     if (chapterRect.top > window.innerHeight || chapterRect.bottom < 0) {
    //         return;
    //     }

    //     const scrollAmountInChapter = window.scrollY - chapter6.offsetTop;
    //     const animationDuration = chapter6.scrollHeight - window.innerHeight;
    //     const progress = Math.max(0, Math.min(1, scrollAmountInChapter / animationDuration));

    //     // --- MANAGE VISIBILITY AND OPACITY BASED ON SCROLL PROGRESS ---

    //     // Define the animation phases
    //     const textFadeInEnd = 0.2;
    //     const textZoomStart = 0.25;
    //     const textZoomEnd = 0.6;
    //     const reasonsFadeInStart = 0.65;
        
    //     // Set background opacity
    //     if (progress > 0) {
    //         const bgProgress = Math.min(1, progress / textFadeInEnd);
    //         chapter6.style.setProperty('--bg-opacity', bgProgress);
    //     } else {
    //         chapter6.style.setProperty('--bg-opacity', 0);
    //     }
        
    //     // Animate "I Love You" text
    //     if (progress > 0 && progress < textZoomEnd) {
    //         loveYouText.style.visibility = 'visible';

    //         // Fade in
    //         let opacity = 1;
    //         if (progress < textFadeInEnd) {
    //             opacity = progress / textFadeInEnd;
    //         }

    //         // Zoom out
    //         if (progress > textZoomStart) {
    //             const zoomProgress = (progress - textZoomStart) / (textZoomEnd - textZoomStart);
    //             const scale = 1 + zoomProgress * 8;
    //             opacity = 1 - zoomProgress;
    //             loveYouText.style.transform = `scale(${scale})`;
    //         } else {
    //             loveYouText.style.transform = 'scale(1)';
    //         }
    //         loveYouText.style.opacity = opacity;

    //     } else {
    //         loveYouText.style.visibility = 'hidden';
    //         loveYouText.style.opacity = 0;
    //     }

    //     console.log("Chapter 6 progress: ", progress);
    //     console.log("Reason fadeIN start", reasonsFadeInStart);

    //     // Animate "100 Reasons" container
    //     if (progress > reasonsFadeInStart) {
    //         reasonsContainer.style.visibility = 'visible';
    //         const reasonsProgress = (progress - reasonsFadeInStart) / (1 - reasonsFadeInStart);
    //         reasonsContainer.style.opacity = Math.min(1, reasonsProgress * 2); // Multiply by 2 to fade in faster
    //     } else {
    //         reasonsContainer.style.visibility = 'hidden';
    //         reasonsContainer.style.opacity = 0;
    //     }
    // }

    // --- INITIAL CALLS ---
    handleFadingScenes();
    handleCollageScroll();
    // handleFinaleChapter();
});
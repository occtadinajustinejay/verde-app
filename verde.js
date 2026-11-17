//Verde app Where i have my own liesure time :3
//If 



// ============================================
// VERDE — MAIN JAVASCRIPT
// A world of your own. ✦
// ============================================


// ============================================
// 1. VERDE APPLICATION
// ============================================

const VERDE = {
    name: "VERDE",
    version: "1.0.0",
    theme: "light"
};


// ============================================
// 2. SELECT HTML ELEMENTS
// ============================================

const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");

const navigationButtons = document.querySelectorAll("[data-view]");
const pageViews = document.querySelectorAll(".page-view");

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

const themeToggle = document.getElementById("themeToggle");

const postForm = document.getElementById("postForm");
const postCaption = document.getElementById("postCaption");
const postMedia = document.getElementById("postMedia");
const mediaPreview = document.getElementById("mediaPreview");

const feedContainer = document.getElementById("feedContainer");

const writingForm = document.getElementById("writingForm");
const writingTitle = document.getElementById("writingTitle");
const writingContent = document.getElementById("writingContent");
const draftContainer = document.getElementById("draftContainer");


// ============================================
// 3. LOCAL STORAGE
// ============================================

const STORAGE_KEYS = {
    posts: "verde_posts",
    drafts: "verde_drafts",
    profile: "verde_profile",
    theme: "verde_theme"
};


function getLocalData(key) {

    try {
        const data = localStorage.getItem(key);

        return data ? JSON.parse(data) : [];

    } catch (error) {

        console.error("VERDE storage error:", error);

        return [];

    }

}


function saveLocalData(key, data) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );

        return true;

    } catch (error) {

        console.error("Unable to save data:", error);

        alert("VERDE could not save this data. Check your available storage.");

        return false;

    }

}


// ============================================
// 4. NAVIGATION SYSTEM
// ============================================

const pageInformation = {

    home: {
        title: "Home",
        subtitle: "Welcome to your little world."
    },

    explore: {
        title: "Explore",
        subtitle: "Discover your interests."
    },

    create: {
        title: "Create",
        subtitle: "Make something meaningful."
    },

    videos: {
        title: "Videos",
        subtitle: "Your personal video space."
    },

    notifications: {
        title: "Notifications",
        subtitle: "Your recent activity."
    },

    messages: {
        title: "Messages",
        subtitle: "Your message space."
    },

    profile: {
        title: "My Profile",
        subtitle: "Your personal identity."
    },

    library: {
        title: "My Library",
        subtitle: "Your saved memories."
    },

    writing: {
        title: "Writing Studio",
        subtitle: "A place for your words."
    },

    music: {
        title: "Music",
        subtitle: "Your personal soundtrack."
    },

    settings: {
        title: "Settings",
        subtitle: "Manage your VERDE experience."
    }

};


function navigateTo(viewName) {

    const targetView = document.getElementById(
        `view-${viewName}`
    );

    if (!targetView) return;


    // Hide every page.

    pageViews.forEach(view => {

        view.classList.remove("active");

    });


    // Display selected page.

    targetView.classList.add("active");


    // Update page title.

    const information = pageInformation[viewName];

    if (information) {

        pageTitle.textContent = information.title;

        pageSubtitle.textContent = information.subtitle;

    }


    // Update navigation highlights.

    navigationButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.view === viewName
        );

    });


    // Close mobile sidebar.

    sidebar.classList.remove("sidebar-open");

}


navigationButtons.forEach(button => {

    button.addEventListener("click", () => {

        navigateTo(button.dataset.view);

    });

});


// ============================================
// 5. MOBILE SIDEBAR
// ============================================

menuToggle.addEventListener("click", () => {

    sidebar.classList.toggle("sidebar-open");

});


// ============================================
// 6. LIGHT AND DARK MODE
// ============================================

function applyTheme(theme) {

    VERDE.theme = theme;

    document.body.classList.toggle(
        "dark-mode",
        theme === "dark"
    );

    themeToggle.textContent =
        theme === "dark" ? "☀" : "☾";

    localStorage.setItem(
        STORAGE_KEYS.theme,
        theme
    );

}


themeToggle.addEventListener("click", () => {

    const newTheme =
        VERDE.theme === "light" ? "dark" : "light";

    applyTheme(newTheme);

});


const savedTheme = localStorage.getItem(
    STORAGE_KEYS.theme
);

applyTheme(savedTheme || "light");


// ============================================
// 7. IMAGE AND VIDEO PREVIEW
// ============================================

let selectedMedia = [];


postMedia.addEventListener("change", () => {

    mediaPreview.innerHTML = "";

    selectedMedia = Array.from(postMedia.files);

    selectedMedia.forEach(file => {

        const fileURL = URL.createObjectURL(file);

        let previewElement;


        if (file.type.startsWith("image/")) {

            previewElement = document.createElement("img");

            previewElement.src = fileURL;

        } else if (file.type.startsWith("video/")) {

            previewElement = document.createElement("video");

            previewElement.src = fileURL;

            previewElement.controls = true;

        } else {

            URL.revokeObjectURL(fileURL);

            return;

        }


        previewElement.classList.add("preview-media");

        mediaPreview.appendChild(previewElement);

    });

});


// ============================================
// 8. POST CREATION
// ============================================

function createPost() {

    const caption = postCaption.value.trim();

    if (!caption && selectedMedia.length === 0) {

        alert("Write something or select a photo/video first.");

        return;

    }


    const posts = getLocalData(STORAGE_KEYS.posts);


    const newPost = {

        id: Date.now(),

        caption: caption,

        media: selectedMedia.map(file => ({

            name: file.name,

            type: file.type,

            size: file.size

        })),

        createdAt: new Date().toISOString(),

        likes: 0,

        comments: 0

    };


    // This first version saves post information.
    // Actual media files will be stored in IndexedDB later.

    posts.unshift(newPost);


    if (!saveLocalData(STORAGE_KEYS.posts, posts)) {

        return;

    }


    alert("Your post information has been saved! ✦");


    postForm.reset();

    mediaPreview.innerHTML = "";

    selectedMedia = [];

    renderPosts();

    navigateTo("home");

}


postForm.addEventListener("submit", event => {

    event.preventDefault();

    createPost();

});


// ============================================
// 9. DISPLAY POSTS
// ============================================

function renderPosts() {

    const posts = getLocalData(STORAGE_KEYS.posts);

    feedContainer.innerHTML = "";


    if (posts.length === 0) {

        feedContainer.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">✦</div>

                <h3>Your space is waiting.</h3>

                <p>Create your first post and fill your world.</p>

                <button class="primary-button" data-view="create">
                    Create a Post
                </button>

            </div>

        `;

        return;

    }


    posts.forEach(post => {

        const postCard = document.createElement("article");

        postCard.classList.add("post-card");


        const postHeading = document.createElement("h3");

        postHeading.textContent = "My VERDE Post";


        const postText = document.createElement("p");

        postText.textContent = post.caption;


        const postDate = document.createElement("small");

        postDate.textContent = new Date(
            post.createdAt
        ).toLocaleString();


        postCard.appendChild(postHeading);

        postCard.appendChild(postText);

        postCard.appendChild(postDate);


        const postActions = document.createElement("div");

        postActions.classList.add("post-actions");


        const likeButton = document.createElement("button");

        likeButton.textContent = `♡ ${post.likes}`;

        likeButton.addEventListener("click", () => {

            post.likes++;

            saveLocalData(STORAGE_KEYS.posts, posts);

            renderPosts();

        });


        postActions.appendChild(likeButton);

        postCard.appendChild(postActions);


        feedContainer.appendChild(postCard);

    });

}


// ============================================
// 10. FOLLOWING AND FOR YOU TABS
// ============================================

const feedTabs = document.querySelectorAll(".feed-tab");


feedTabs.forEach(tab => {

    tab.addEventListener("click", () => {

        feedTabs.forEach(item => {

            item.classList.remove("active");

        });

        tab.classList.add("active");

    });

});


// ============================================
// 11. WRITING STUDIO
// ============================================

function saveDraft() {

    const title = writingTitle.value.trim();

    const content = writingContent.value.trim();


    if (!title && !content) {

        alert("Write something before saving your draft.");

        return;

    }


    const drafts = getLocalData(STORAGE_KEYS.drafts);


    const newDraft = {

        id: Date.now(),

        title: title || "Untitled Creation",

        content: content,

        createdAt: new Date().toISOString()

    };


    drafts.unshift(newDraft);


    if (!saveLocalData(STORAGE_KEYS.drafts, drafts)) {

        return;

    }


    alert("Your draft has been saved! ✧");


    writingForm.reset();

    renderDrafts();

}


writingForm.addEventListener("submit", event => {

    event.preventDefault();

    saveDraft();

});


// ============================================
// 12. DISPLAY SAVED DRAFTS
// ============================================

function renderDrafts() {

    const drafts = getLocalData(STORAGE_KEYS.drafts);

    draftContainer.innerHTML = "";


    if (drafts.length === 0) {

        draftContainer.innerHTML = `

            <div class="empty-state">

                <p>No saved drafts yet.</p>

            </div>

        `;

        return;

    }


    drafts.forEach(draft => {

        const draftCard = document.createElement("article");

        draftCard.classList.add("draft-card");


        const title = document.createElement("h3");

        title.textContent = draft.title;


        const content = document.createElement("p");

        content.textContent = draft.content;


        const editButton = document.createElement("button");

        editButton.textContent = "Edit";


        editButton.addEventListener("click", () => {

            writingTitle.value = draft.title;

            writingContent.value = draft.content;

            navigateTo("writing");

        });


        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";


        deleteButton.addEventListener("click", () => {

            deleteDraft(draft.id);

        });


        draftCard.appendChild(title);

        draftCard.appendChild(content);

        draftCard.appendChild(editButton);

        draftCard.appendChild(deleteButton);


        draftContainer.appendChild(draftCard);

    });

}


// ============================================
// 13. DELETE DRAFT
// ============================================

function deleteDraft(draftID) {

    const confirmed = confirm(
        "Are you sure you want to delete this draft?"
    );

    if (!confirmed) return;


    const drafts = getLocalData(STORAGE_KEYS.drafts);

    const updatedDrafts = drafts.filter(draft => {

        return draft.id !== draftID;

    });


    if (saveLocalData(STORAGE_KEYS.drafts, updatedDrafts)) {

        renderDrafts();

    }

}


// ============================================
// 14. PROFILE EDITING
// ============================================

const editProfileButton = document.getElementById("editProfile");


editProfileButton.addEventListener("click", () => {

    const currentProfile = getLocalData(
        STORAGE_KEYS.profile
    );


    const currentName = currentProfile.name || "My VERDE Profile";

    const currentBio = currentProfile.bio ||
        "A little world of memories, creativity and stories. ✦";


    const newName = prompt(
        "Enter your display name:",
        currentName
    );

    if (newName === null) return;


    const newBio = prompt(
        "Enter your biography:",
        currentBio
    );

    if (newBio === null) return;


    const updatedProfile = {

        name: newName.trim() || currentName,

        bio: newBio.trim()

    };


    if (!saveLocalData(
        STORAGE_KEYS.profile,
        updatedProfile
    )) {

        return;

    }


    renderProfile();

    alert("Your profile has been updated! ✦");

});


// ============================================
// 15. DISPLAY PROFILE
// ============================================

function renderProfile() {

    const profile = getLocalData(
        STORAGE_KEYS.profile
    );


    document.getElementById("profileName").textContent =
        profile.name || "My VERDE Profile";


    document.getElementById("profileBio").textContent =
        profile.bio ||
        "A little world of memories, creativity and stories. ✦";

}


renderProfile();


// ============================================
// 16. SETTINGS INTERACTIONS
// ============================================

const settingButtons = document.querySelectorAll(
    "[data-setting]"
);


settingButtons.forEach(button => {

    button.addEventListener("click", () => {

        const settingName = button.dataset.setting;


        const messages = {

            appearance: "Use the moon button in the top bar to switch themes.",

            privacy: "Your personal content is stored locally in this version.",

            storage: "Storage management will be developed in a later stage.",

            accessibility: "Accessibility controls will be developed in a later stage.",

            backup: "Local export and backup tools will be developed later.",

            about: "VERDE Version 1.0.0 — A world of your own. ✦"

        };


        alert(messages[settingName] || "Coming soon!");

    });

});


// ============================================
// 17. INITIALIZE VERDE
// ============================================

function initializeVERDE() {

    renderPosts();

    renderDrafts();

    renderProfile();

    navigateTo("home");

    console.log("VERDE initialized successfully. ✦");

}


initializeVERDE();

// EMOJI PICKER
const emojiToggle = document.getElementById("emojiToggle");
const emojiPicker = document.getElementById("emojiPicker");
const postCaption = document.getElementById("postCaption");

// Open and close emoji picker
emojiToggle.addEventListener("click", () => {
    emojiPicker.hidden = !emojiPicker.hidden;
});

// Insert selected emoji into caption
document.querySelectorAll(".emoji-option").forEach(button => {
    button.addEventListener("click", () => {
        const emoji = button.textContent;

        const start = postCaption.selectionStart;
        const end = postCaption.selectionEnd;

        const before = postCaption.value.slice(0, start);
        const after = postCaption.value.slice(end);

        postCaption.value = before + emoji + after;

        postCaption.focus();

        const newPosition = start + emoji.length;
        postCaption.setSelectionRange(newPosition, newPosition);
    });
});



// ============================================
// END OF VERDE JAVASCRIPT
// ============================================

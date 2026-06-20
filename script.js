 function addTopic()
{
    let topic = document.getElementById("topicInput").value;

    if(topic === "")
    {
        return;
    }

    createItem(topic, "topicList");

     let topics = JSON.parse(localStorage.getItem("topics")) || [];

    topics.push(topic);

    localStorage.setItem("topics", JSON.stringify(topics));

    document.getElementById("topicInput").value = "";

    updateStats();
    addActivity("Added Topic: " + topic);
}
   

    function addProject()
{
    let project = document.getElementById("projectInput").value;

    if(project === "")
    {
        return;
    }

    createItem(project, "projectList");

    let projects = JSON.parse(localStorage.getItem("projects")) || [];

    projects.push(project);

    localStorage.setItem("projects", JSON.stringify(projects));


    document.getElementById("projectInput").value = "";

    updateStats();
    updateReadiness();
    addActivity("Added Project: " + project);
}

function addCompany()
{
    let company = document.getElementById("companyInput").value;
    let status = document.getElementById("companyStatus").value;

    if(company === "")
    {
        return;
    }

    let companies =JSON.parse(localStorage.getItem("companies")) || [];

companies.push({company: company,status: status});

localStorage.setItem("companies",JSON.stringify(companies));
    createCompanyItem(company, status);

    document.getElementById("companyInput").value = "";

    document.getElementById("companyStatus").selectedIndex = 0;

    updateStats();
    updateReadiness();
    addActivity("Added Company: " + company);
}

function createCompanyItem(company, status)
{

    if(!company) return; // prevents empty render

    let div = document.createElement("div");
    div.classList.add("company-item");

    let top = document.createElement("div");
    top.classList.add("company-top");

    let name = document.createElement("span");
    name.classList.add("company-name");
    name.innerText = company;

     // SAFE fallback
    name.innerText = company || "Unknown Company";

    let statusSpan = document.createElement("span");
    statusSpan.classList.add("status-badge");
    statusSpan.innerText = status;

    applyStatusColor(statusSpan, status);

    top.appendChild(name);
    top.appendChild(statusSpan);

    let actions = document.createElement("div");
    actions.classList.add("company-actions");

    let editBtn = document.createElement("button");
    editBtn.innerText = "Edit";

    let delBtn = document.createElement("button");
    delBtn.innerText = "Delete";

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    div.appendChild(top);
    div.appendChild(actions);


    console.log("Company:", company);
    console.log("Status:", status);

    document.getElementById("companyList").appendChild(div);

editBtn.onclick = function () {
    let select = document.createElement("select");

    let statuses = [
        "Applied",
        "Online Assessment",
        "Interview",
        "Selected",
        "Rejected"
    ];

    statuses.forEach(s => {
        let option = document.createElement("option");
        option.value = s;
        option.innerText = s;

        if (s === status) option.selected = true;

        select.appendChild(option);
    });

    statusSpan.replaceWith(select);

    select.onchange = function () {
        let newStatus = select.value;

        let companies = JSON.parse(localStorage.getItem("companies")) || [];

        let item = companies.find(c =>
            c.company === company && c.status === status
        );

        if (item) item.status = newStatus;

        localStorage.setItem("companies", JSON.stringify(companies));

        status = newStatus;

        statusSpan.innerText = newStatus;
        applyStatusColor(statusSpan, newStatus);

        select.replaceWith(statusSpan);
    };
};

delBtn.onclick = function () {
    div.remove();

    let companies = JSON.parse(localStorage.getItem("companies")) || [];

    companies = companies.filter(c =>
        !(c.company === company && c.status === status)
    );

    localStorage.setItem("companies", JSON.stringify(companies));

    updateStats();
};


}

function applyStatusColor(statusSpan, status)
{
    statusSpan.className = "status-badge";

    if(status === "Applied")
        statusSpan.classList.add("applied");

    else if(status === "Online Assessment")
        statusSpan.classList.add("assessment");

    else if(status === "Interview")
        statusSpan.classList.add("interview");

    else if(status === "Selected")
        statusSpan.classList.add("selected");

    else if(status === "Rejected")
        statusSpan.classList.add("rejected");
}

function searchAll()
{
    let input =
    document.getElementById("searchInput")
    .value
    .toLowerCase();

    let items =
    document.querySelectorAll(".tracker-item ,.company-item");

    items.forEach(item =>
    {
        let text =
        item.innerText.toLowerCase();

        if(text.includes(input))
        {
            item.style.display = "flex";
        }
        else
        {
            item.style.display = "none";
        }
    });
}


function filterCompanies(status)
{
    let items =
    document.querySelectorAll(".company-item");

    items.forEach(item =>
    {
        let companyStatus =
        item.querySelector(".status-badge")
        .innerText;

        if(status === "All" ||
           companyStatus === status)
        {
            item.style.display = "flex";
        }
        else
        {
            item.style.display = "none";
        }
    });
}

function createItem(text, listId)
{
    let div = document.createElement("div");
    div.classList.add("tracker-item");

    let span = document.createElement("span");
    span.innerText = text;

    let input = document.createElement("input");
    input.type = "text";
    input.value = text;
    input.style.display = "none";

    let actions = document.createElement("div");
    actions.classList.add("tracker-actions");

    let editBtn = document.createElement("button");
    editBtn.innerText = "Edit";

    let delBtn = document.createElement("button");
    delBtn.innerText = "Delete";

    let saveBtn = document.createElement("button");
    saveBtn.innerText = "Save";
    saveBtn.style.display = "none";

    let isEditing = false;

    // EDIT TOGGLE
    editBtn.onclick = function ()
    {
        isEditing = !isEditing;

        if (isEditing)
        {
            input.value = span.innerText;

            span.style.display = "none";
            input.style.display = "inline-block";

            saveBtn.style.display = "inline-block";
            editBtn.innerText = "Cancel";
        }
        else
        {
            span.style.display = "inline-block";
            input.style.display = "none";

            saveBtn.style.display = "none";
            editBtn.innerText = "Edit";
        }
    };

    // SAVE
    saveBtn.onclick = function ()
    {
        let newText = input.value.trim();
        if (!newText) return;

        let key = listId === "topicList" ? "topics" : "projects";
        let data = JSON.parse(localStorage.getItem(key)) || [];

        let index = data.indexOf(text);
        if (index !== -1) data[index] = newText;

        localStorage.setItem(key, JSON.stringify(data));

        text = newText;
        span.innerText = newText;

        // exit edit mode
        isEditing = false;
        span.style.display = "inline-block";
        input.style.display = "none";
        saveBtn.style.display = "none";
        editBtn.innerText = "Edit";

        updateStats();
    };

    // DELETE
    delBtn.onclick = function ()
    {
        div.remove();

        let key = listId === "topicList" ? "topics" : "projects";
        let data = JSON.parse(localStorage.getItem(key)) || [];

        data = data.filter(item => item !== text);

        localStorage.setItem(key, JSON.stringify(data));

        updateStats();
        addActivity("Deleted: " + text);
    };

    actions.appendChild(editBtn);
    actions.appendChild(saveBtn);
    actions.appendChild(delBtn);

    div.appendChild(span);
    div.appendChild(input);
    div.appendChild(actions);

    document.getElementById(listId).appendChild(div);

    updateStats();
}

function toggleTheme()
{
    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode"))
    {
        localStorage.setItem("theme","dark");

        document.getElementById("themeBtn")
        .innerText = "☀️";
    }
    else
    {
        localStorage.setItem("theme","light");

        document.getElementById("themeBtn")
        .innerText = "🌙";
    }
}

window.onload = function()
{
    let topics = JSON.parse(localStorage.getItem("topics")) || [];

    for(let topic of topics)
    {
        createItem(topic, "topicList");
    }

    let projects = JSON.parse(localStorage.getItem("projects")) || [];

    for(let project of projects)
    {
        createItem(project, "projectList");
    }
    let companies =JSON.parse(localStorage.getItem("companies")) || [];

    for(let company of companies)
{
    createCompanyItem(
        company.company,
        company.status
    );
}


let savedTheme =
localStorage.getItem("theme");

if(savedTheme === "dark")
{
    document.body.classList.add("dark-mode");

    document.getElementById("themeBtn")
    .innerText = "☀️";
}

let resumes =
JSON.parse(
localStorage.getItem("resumes")
) || [];

for(let resume of resumes)
{
    createResumeItem(resume);
}


let questions =
JSON.parse(localStorage.getItem("questions")) || [];

for(let question of questions)
{
    createQuestionItem(question);
}



updateStats();
loadActivities();
updateResumeStats();
updateQuestionStats();
updateReadiness();
};

function updateStats()
{

    
    let topics =
    JSON.parse(localStorage.getItem("topics")) || [];

    let projects =
    JSON.parse(localStorage.getItem("projects")) || [];

    let companies =
    JSON.parse(localStorage.getItem("companies")) || [];

    let resumes =
    JSON.parse(localStorage.getItem("resumes")) || [];

    document.getElementById("resumeCount")
    .innerText = resumes.length;

    document.getElementById("topicCount").innerText =
    topics.length;

    document.getElementById("projectCount").innerText =
    projects.length;

    document.getElementById("companyCount").innerText =
    companies.length;

    let questions =
JSON.parse(localStorage.getItem("questions")) || [];

document.getElementById("questionCount").innerText =
questions.length;


}
function searchTopics()
{
    let input = document.getElementById("searchInput") .value .toLowerCase();

    let items =document.querySelectorAll(".tracker-item");

    items.forEach(item =>
    {
        let text = item.querySelector("span") .innerText .toLowerCase();

        if(text.includes(input))
        {
            item.style.display = "flex";
        }
        else
        {
            item.style.display = "none";
        }
    });
}

function addActivity(message)
{
    let activities =
    JSON.parse(
    localStorage.getItem("activities")
    ) || [];

    activities.unshift(message);

    localStorage.setItem(
    "activities",
    JSON.stringify(activities)
    );

    loadActivities();
}

function loadActivities()
{
    let activities =JSON.parse(localStorage.getItem("activities")) || [];

    let list =document.getElementById("activityList"); list.innerHTML = "";

    activities.slice(0,10).forEach(item =>{let div = document.createElement("div");

        div.classList.add("activity-item");

        div.innerText = item;

        list.appendChild(div);
    });
}


function addResume()
{
    console.log("Resume Added");

    let resumeName =
    document.getElementById("resumeName").value;

    let resumeRole =
    document.getElementById("resumeRole").value;

    if(resumeName === "")
    {
        return;
    }

    let resumes =
    JSON.parse(localStorage.getItem("resumes")) || [];

    let resume =
    {
        name: resumeName,
        role: resumeRole
    };

    resumes.push(resume);

    localStorage.setItem(
        "resumes",
        JSON.stringify(resumes)
    );

    createResumeItem(resume);

    document.getElementById("resumeName").value = "";

    updateStats();
    updateReadiness();
    updateResumeStats();

    addActivity(
        "Added Resume: " +
        resumeName +
        " (" +
        resumeRole +
        ")"
    );
}

function createResumeItem(resume)
{
    let div = document.createElement("div");

    div.classList.add("tracker-item");

    let span = document.createElement("span");

    span.innerText =
    resume.name + " (" + resume.role + ")";

    let deleteBtn =
    document.createElement("button");

    deleteBtn.innerText = "Delete";

    deleteBtn.onclick = function()
    {
        div.remove();

        let resumes =
        JSON.parse(localStorage.getItem("resumes")) || [];

        resumes = resumes.filter(item =>
            !(item.name === resume.name &&
              item.role === resume.role)
        );

        localStorage.setItem(
            "resumes",
            JSON.stringify(resumes)
        );

        updateStats();
        updateResumeStats();
    };

    div.appendChild(span);
    div.appendChild(deleteBtn);

    document
    .getElementById("resumeList")
    .appendChild(div);
}


function updateResumeStats()
{
    let resumes =
    JSON.parse(localStorage.getItem("resumes")) || [];

    let sde = 0;
    let frontend = 0;
    let backend = 0;
    let fullstack = 0;
    let aiml = 0;

   
    resumes.forEach(resume =>
    {
        if(resume.role === "SDE")
            sde++;

        else if(resume.role === "Frontend")
            frontend++;

        else if(resume.role === "Backend")
            backend++;

        else if(resume.role === "Full Stack")
            fullstack++;

        else if(resume.role === "AI/ML")
            aiml++;
    });

    console.log(
JSON.parse(localStorage.getItem("resumes"))
);

    document.getElementById("totalResumeCount").innerText =
    resumes.length;

    document.getElementById("sdeResumeCount").innerText =
    sde;

    document.getElementById("frontendResumeCount").innerText =
    frontend;

    document.getElementById("backendResumeCount").innerText =
    backend;

    document.getElementById("fullstackResumeCount").innerText =
    fullstack;

    document.getElementById("aimlResumeCount").innerText =
    aiml;
}

//dsa question manager
function addQuestion()
{
    let title =
    document.getElementById("questionName").value;

    let topic =
    document.getElementById("questionTopic").value;

    let difficulty =
    document.getElementById("questionDifficulty").value;

    let status =
    document.getElementById("questionStatus").value;

    if(title === "")
    {
        return;
    }

    let questions =
    JSON.parse(localStorage.getItem("questions")) || [];

    let question =
    {
        title: title,
        topic: topic,
        difficulty: difficulty,
        status: status
    };

    questions.push(question);

    localStorage.setItem(
        "questions",
        JSON.stringify(questions)
    );

    createQuestionItem(question);

    document.getElementById("questionName").value = "";

    updateQuestionStats();
    updateReadiness();
}

function createQuestionItem(question)
{
    let div = document.createElement("div");

    div.classList.add("tracker-item");

    let info = document.createElement("div");

    info.innerHTML =
    `
    <strong>${question.title}</strong><br>
    ${question.topic} |
    ${question.difficulty} |
    ${question.status}
    `;

    let deleteBtn =
    document.createElement("button");

    deleteBtn.innerText = "Delete";

    deleteBtn.onclick = function()
    {
        div.remove();

        let questions =
        JSON.parse(localStorage.getItem("questions")) || [];

        questions = questions.filter(q =>
            !(q.title === question.title &&
              q.topic === question.topic)
        );

        localStorage.setItem(
            "questions",
            JSON.stringify(questions)
        );

        updateQuestionStats();
    };

    div.appendChild(info);
    div.appendChild(deleteBtn);

    document
    .getElementById("questionList")
    .appendChild(div);
}

function updateQuestionStats()
{
    let questions =
    JSON.parse(localStorage.getItem("questions")) || [];

    let easy = 0;
    let medium = 0;
    let hard = 0;
    let solved = 0;

    questions.forEach(q =>
    {
        if(q.difficulty === "Easy")
        {
            easy++;
        }

        if(q.difficulty === "Medium")
        {
            medium++;
        }

        if(q.difficulty === "Hard")
        {
            hard++;
        }

        if(q.status === "Solved")
        {
            solved++;
        }
        let total = questions.length;

     let dsaReadinessValue = 0;

if(questions.length > 0)
{
    dsaReadiness =
    Math.round(
        (solved / questions.length) * 100
    );
}

    });

    document.getElementById("questionCount").innerText =
    questions.length;

    document.getElementById("easyCount").innerText =
    easy;

    document.getElementById("mediumCount").innerText =
    medium;

    document.getElementById("hardCount").innerText =
    hard;

    document.getElementById("solvedCount").innerText =
    solved;

    document.getElementById("dsaReadiness").innerText =
dsaReadinessValue + "%";

}

function updateReadiness()
{
    let questions =
    JSON.parse(localStorage.getItem("questions")) || [];

    let projects =
    JSON.parse(localStorage.getItem("projects")) || [];

    let resumes =
    JSON.parse(localStorage.getItem("resumes")) || [];

    let companies =
    JSON.parse(localStorage.getItem("companies")) || [];

    let solvedQuestions =
    questions.filter(
        q => q.status === "Solved"
    ).length;

    let dsaScore =
Math.min(
(solvedQuestions / 500) * 100,
100
);
let projectScore =
Math.min(
(projects.length / 5) * 100,
100
);
let resumeScore =
Math.min(
(resumes.length / 3) * 100,
100
);

let applicationPoints = 0;

companies.forEach(company =>
{
    if(company.status === "Applied")
        applicationPoints += 1;

    else if(company.status === "Online Assessment")
        applicationPoints += 2;

    else if(company.status === "Interview")
        applicationPoints += 3;

    else if(company.status === "Selected")
        applicationPoints += 5;
});

let applicationScore =
Math.min(
(applicationPoints / 50) * 100,
100
);

   let readiness =

(dsaScore * 0.40) +
(projectScore * 0.25) +
(resumeScore * 0.15) +
(applicationScore * 0.20);

readiness = Math.round(readiness);

    document.getElementById("readinessScore"
).innerText =
    readiness + "%";

    document.getElementById("readinessBar").style.width =
readiness + "%";

let bar =
document.getElementById("readinessBar");


if(readiness < 40)
{
    bar.style.background = "#ef4444";
}
else if(readiness < 70)
{
    bar.style.background = "#f59e0b";
}
else
{
    bar.style.background = "#22c55e";
}
}
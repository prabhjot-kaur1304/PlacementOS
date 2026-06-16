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
}

function createCompanyItem(company, status)
{
    let div = document.createElement("div");

    div.classList.add("topic-item");

    let companySpan =document.createElement("span");

    companySpan.innerText = company;

    let statusSpan =document.createElement("span");

    statusSpan.innerText = status;

if(status === "Applied")
{
    statusSpan.classList.add("applied");
}
else if(status === "Online Assessment")
{
    statusSpan.classList.add("assessment");
}
else if(status === "Interview")
{
    statusSpan.classList.add("interview");
}
else if(status === "Selected")
{
    statusSpan.classList.add("selected");
}
else if(status === "Rejected")
{
    statusSpan.classList.add("rejected");
}

    let editBtn = document.createElement("button");
editBtn.innerText = "Edit";

editBtn.onclick = function()
{
    let select = document.createElement("select");

    let statuses = [
        "Applied",
        "Online Assessment",
        "Interview",
        "Selected",
        "Rejected"
    ];

    statuses.forEach(s =>
    {
        let option = document.createElement("option");
        option.value = s;
        option.text = s;

        if(s === status)
        {
            option.selected = true;
        }

        select.appendChild(option);
    });

    statusSpan.replaceWith(select);

    select.onchange = function()
    {
        let newStatus = select.value;

        let companies =
        JSON.parse(localStorage.getItem("companies")) || [];

        let item = companies.find(
            c => c.company === company &&
                 c.status === status
        );

        if(item)
        {
            item.status = newStatus;
        }

        localStorage.setItem(
            "companies",
            JSON.stringify(companies)
        );

        status = newStatus;

        statusSpan.innerText = newStatus;
        select.replaceWith(statusSpan);
    };
};

    let btn =document.createElement("button");

    btn.innerText = "Delete";

    btn.onclick = function()
    {
        div.remove();

        let companies =JSON.parse(localStorage.getItem("companies")) || [];

        companies = companies.filter(item =>!(item.company === company &&  item.status === status));

        localStorage.setItem("companies",JSON.stringify(companies));

         updateStats();
    };

    div.appendChild(companySpan);
    div.appendChild(statusSpan);
    div.appendChild(editBtn);
    div.appendChild(btn);

    document.getElementById("companyList").appendChild(div);

   
}


function createItem(text, listId)
{
    let div = document.createElement("div");

    div.classList.add("topic-item");

    let span = document.createElement("span");
    span.innerText = text;

    let btn = document.createElement("button");
    btn.innerText = "Delete";

    btn.onclick = function()
    {
        div.remove();

         let key =
        listId === "topicList"
        ? "topics"
        : "projects";

        let data =JSON.parse(localStorage.getItem(key)) || [];

        data = data.filter(item => item !== text);

        localStorage.setItem(key, JSON.stringify(data));

        updateStats();
    };

    let editBtn = document.createElement("button");
editBtn.innerText = "Edit"; 

editBtn.onclick = function()
{
    let newText = prompt("Edit Item", text);

    if(newText === null || newText === "")
    {
        return;
    }

    span.innerText = newText;

    let key =
    listId === "topicList"
    ? "topics"
    : "projects";

    let data =
    JSON.parse(localStorage.getItem(key)) || [];

    let index = data.indexOf(text);

    if(index !== -1)
    {
        data[index] = newText;
    }

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

    text = newText;
};

    div.appendChild(span);
    div.appendChild(editBtn);
    div.appendChild(btn);

    document.getElementById(listId).appendChild(div);

    updateStats();
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
    let companies =
JSON.parse(
localStorage.getItem("companies")
) || [];

for(let item of companies)
{
    createCompanyItem(
        item.company,
        item.status
    );
}

updateStats();
};

function updateStats()
{
    let topics =
    JSON.parse(localStorage.getItem("topics")) || [];

    let projects =
    JSON.parse(localStorage.getItem("projects")) || [];

    let companies =
    JSON.parse(localStorage.getItem("companies")) || [];

    document.getElementById("topicCount").innerText =
    topics.length;

    document.getElementById("projectCount").innerText =
    projects.length;

    document.getElementById("companyCount").innerText =
    companies.length;
}
function searchTopics()
{
    let input =
    document.getElementById("searchInput")
    .value
    .toLowerCase();

    let items =
    document.querySelectorAll("#topicList .topic-item");

    items.forEach(item =>
    {
        let text =
        item.querySelector("span")
        .innerText
        .toLowerCase();

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
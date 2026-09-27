/* =========================================================
   STUDYFLOW
   ORGANIZADOR DE ESTUDOS
========================================================= */


/* =========================================================
   BANCO DE DADOS LOCAL
========================================================= */

const DB_KEY = "studyflow_database";

let db = JSON.parse(localStorage.getItem(DB_KEY)) || {

    subjects: [],

    tasks: [],

    schedules: [],

    goals: [],

    notes: [],

    studySessions: [],

    settings: {
        theme: "dark"
    }

};


/* =========================================================
   SALVAR
========================================================= */

function saveDatabase() {

    localStorage.setItem(
        DB_KEY,
        JSON.stringify(db)
    );

}


/* =========================================================
   ID
========================================================= */

function generateId() {

    return Date.now().toString(36) +
        Math.random()
            .toString(36)
            .substring(2, 8);

}


/* =========================================================
   NOTIFICAÇÃO
========================================================= */

function notify(message, type = "success") {

    const notification =
        document.getElementById("notification");

    const text =
        document.getElementById("notificationText");

    const icon =
        document.getElementById("notificationIcon");

    text.textContent = message;

    icon.textContent =
        type === "error" ? "!" : "✓";

    notification.classList.add("show");

    setTimeout(() => {

        notification.classList.remove("show");

    }, 2500);

}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

const menuItems =
    document.querySelectorAll(".menu-item[data-page]");

const pages =
    document.querySelectorAll(".page");

const pageTitle =
    document.getElementById("pageTitle");

const pageSubtitle =
    document.getElementById("pageSubtitle");


const pageInfo = {

    dashboard: [
        "Dashboard",
        "Organize seus estudos e acompanhe seu progresso."
    ],

    estudos: [
        "Meus Estudos",
        "Organize as matérias que você está estudando."
    ],

    tarefas: [
        "Tarefas",
        "Organize trabalhos, exercícios e atividades."
    ],

    agenda: [
        "Agenda",
        "Planeje seus estudos ao longo dos dias."
    ],

    cronometro: [
        "Cronômetro",
        "Controle exatamente quanto tempo você estudou."
    ],

    metas: [
        "Metas",
        "Defina objetivos para manter sua evolução."
    ],

    anotacoes: [
        "Anotações",
        "Guarde informações importantes dos seus estudos."
    ],

    estatisticas: [
        "Estatísticas",
        "Veja sua evolução nos estudos."
    ]

};


function openPage(pageId) {

    pages.forEach(page => {

        page.classList.remove("active");

    });

    const page =
        document.getElementById(pageId);

    if (page) {

        page.classList.add("active");

    }

    menuItems.forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.page === pageId
        );

    });

    if (pageInfo[pageId]) {

        pageTitle.textContent =
            pageInfo[pageId][0];

        pageSubtitle.textContent =
            pageInfo[pageId][1];

    }

    document
        .getElementById("sidebar")
        .classList.remove("open");

    renderAll();

}


menuItems.forEach(item => {

    item.addEventListener("click", () => {

        openPage(item.dataset.page);

    });

});


document
    .querySelectorAll("[data-page-target]")
    .forEach(button => {

        button.addEventListener("click", () => {

            openPage(
                button.dataset.pageTarget
            );

        });

    });


document
    .getElementById("mobileMenu")
    .addEventListener("click", () => {

        document
            .getElementById("sidebar")
            .classList.toggle("open");

    });


/* =========================================================
   MODAL
========================================================= */

const modalOverlay =
    document.getElementById("modalOverlay");

const modalContent =
    document.getElementById("modalContent");

const modalClose =
    document.getElementById("modalClose");


function openModal(content) {

    modalContent.innerHTML = content;

    modalOverlay.classList.add("active");

}


function closeModal() {

    modalOverlay.classList.remove("active");

}


modalClose.addEventListener(
    "click",
    closeModal
);


modalOverlay.addEventListener(
    "click",
    event => {

        if (event.target === modalOverlay) {

            closeModal();

        }

    }
);


/* =========================================================
   BOTÕES QUE ABREM MODAIS
========================================================= */

document
    .querySelectorAll("[data-open]")
    .forEach(button => {

        button.addEventListener("click", () => {

            const type =
                button.dataset.open;

            if (type === "addSubject")
                showSubjectModal();

            if (type === "addTask")
                showTaskModal();

            if (type === "addSchedule")
                showScheduleModal();

            if (type === "addGoal")
                showGoalModal();

            if (type === "addNote")
                showNoteModal();

            if (type === "addStudy")
                showStudyModal();

        });

    });


/* =========================================================
   MATÉRIAS
========================================================= */

function showSubjectModal(editId = null) {

    const subject =
        db.subjects.find(
            item => item.id === editId
        );

    openModal(`

        <h2>
            ${subject ? "Editar matéria" : "Nova matéria"}
        </h2>

        <form id="subjectForm">

            <div class="form-group">

                <label>Nome da matéria</label>

                <input
                    id="subjectName"
                    required
                    value="${subject?.name || ""}"
                    placeholder="Ex: Matemática"
                >

            </div>

            <div class="form-group">

                <label>Descrição</label>

                <input
                    id="subjectDescription"
                    value="${subject?.description || ""}"
                    placeholder="Ex: Matemática básica"
                >

            </div>

            <div class="form-group">

                <label>Progresso (%)</label>

                <input
                    id="subjectProgressInput"
                    type="number"
                    min="0"
                    max="100"
                    value="${subject?.progress || 0}"
                >

            </div>

            <div class="form-group">

                <label>Cor</label>

                <input
                    id="subjectColor"
                    type="color"
                    value="${subject?.color || "#3b82f6"}"
                >

            </div>

            <div class="form-actions">

                <button
                    type="button"
                    class="secondary-button"
                    onclick="closeModal()"
                >
                    Cancelar
                </button>

                <button
                    class="primary-button"
                    type="submit"
                >
                    Salvar
                </button>

            </div>

        </form>

    `);


    document
        .getElementById("subjectForm")
        .addEventListener("submit", event => {

            event.preventDefault();

            const data = {

                id: editId || generateId(),

                name:
                    document
                        .getElementById("subjectName")
                        .value
                        .trim(),

                description:
                    document
                        .getElementById("subjectDescription")
                        .value
                        .trim(),

                progress:
                    Number(
                        document
                            .getElementById("subjectProgressInput")
                            .value
                    ),

                color:
                    document
                        .getElementById("subjectColor")
                        .value

            };


            if (editId) {

                const index =
                    db.subjects.findIndex(
                        item => item.id === editId
                    );

                db.subjects[index] = data;

                notify("Matéria atualizada.");

            } else {

                db.subjects.push(data);

                notify("Matéria adicionada.");

            }

            saveDatabase();

            closeModal();

            renderAll();

        });

}


function deleteSubject(id) {

    if (!confirm(
        "Deseja realmente excluir esta matéria?"
    )) return;

    db.subjects =
        db.subjects.filter(
            item => item.id !== id
        );

    saveDatabase();

    renderAll();

    notify("Matéria excluída.");

}


/* =========================================================
   RENDER MATÉRIAS
========================================================= */

function renderSubjects() {

    const container =
        document.getElementById("subjectsGrid");

    if (!container) return;

    let subjects =
        [...db.subjects];

    const search =
        document
            .getElementById("subjectSearch")
            ?.value
            .toLowerCase() || "";

    const filter =
        document
            .getElementById("subjectFilter")
            ?.value || "all";


    subjects =
        subjects.filter(subject => {

            const matchesSearch =
                subject.name
                    .toLowerCase()
                    .includes(search);

            let matchesFilter = true;

            if (filter === "progress") {

                matchesFilter =
                    subject.progress < 100;

            }

            if (filter === "completed") {

                matchesFilter =
                    subject.progress >= 100;

            }

            return matchesSearch &&
                matchesFilter;

        });


    if (!subjects.length) {

        container.innerHTML = `

            <div class="empty-state">

                <span>📚</span>

                <p>
                    Nenhuma matéria encontrada.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        subjects.map(subject => `

            <div class="subject-card">

                <div class="subject-top">

                    <div>

                        <div
                            class="subject-color"
                            style="background:${subject.color}"
                        ></div>

                    </div>

                    <div>

                        <button
                            class="small-button"
                            onclick="showSubjectModal('${subject.id}')"
                        >
                            Editar
                        </button>

                        <button
                            class="small-button"
                            onclick="deleteSubject('${subject.id}')"
                        >
                            Excluir
                        </button>

                    </div>

                </div>

                <h3>
                    ${escapeHTML(subject.name)}
                </h3>

                <p>
                    ${escapeHTML(subject.description || "Sem descrição")}
                </p>

                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="width:${subject.progress}%"
                    ></div>

                </div>

                <div class="progress-info">

                    <span>Progresso</span>

                    <strong>
                        ${subject.progress}%
                    </strong>

                </div>

            </div>

        `).join("");

}


/* =========================================================
   TAREFAS
========================================================= */

let currentTaskFilter = "all";


function showTaskModal(editId = null) {

    const task =
        db.tasks.find(
            item => item.id === editId
        );


    openModal(`

        <h2>
            ${task ? "Editar tarefa" : "Nova tarefa"}
        </h2>

        <form id="taskForm">

            <div class="form-group">

                <label>Tarefa</label>

                <input
                    id="taskTitle"
                    required
                    value="${task?.title || ""}"
                    placeholder="Ex: Fazer exercícios de matemática"
                >

            </div>

            <div class="form-group">

                <label>Matéria</label>

                <select id="taskSubject">

                    <option value="">
                        Sem matéria
                    </option>

                    ${db.subjects.map(subject => `

                        <option
                            value="${subject.id}"
                            ${task?.subjectId === subject.id ? "selected" : ""}
                        >
                            ${escapeHTML(subject.name)}
                        </option>

                    `).join("")}

                </select>

            </div>

            <div class="form-group">

                <label>Data de entrega</label>

                <input
                    id="taskDate"
                    type="date"
                    value="${task?.date || ""}"
                >

            </div>

            <div class="form-group">

                <label>Prioridade</label>

                <select id="taskPriority">

                    <option value="low"
                        ${task?.priority === "low" ? "selected" : ""}>
                        Baixa
                    </option>

                    <option value="medium"
                        ${task?.priority === "medium" ? "selected" : ""}>
                        Média
                    </option>

                    <option value="high"
                        ${task?.priority === "high" ? "selected" : ""}>
                        Alta
                    </option>

                </select>

            </div>

            <div class="form-actions">

                <button
                    type="button"
                    class="secondary-button"
                    onclick="closeModal()"
                >
                    Cancelar
                </button>

                <button
                    class="primary-button"
                    type="submit"
                >
                    Salvar
                </button>

            </div>

        </form>

    `);


    document
        .getElementById("taskForm")
        .addEventListener("submit", event => {

            event.preventDefault();


            const data = {

                id: editId || generateId(),

                title:
                    document
                        .getElementById("taskTitle")
                        .value
                        .trim(),

                subjectId:
                    document
                        .getElementById("taskSubject")
                        .value,

                date:
                    document
                        .getElementById("taskDate")
                        .value,

                priority:
                    document
                        .getElementById("taskPriority")
                        .value,

                completed:
                    task?.completed || false

            };


            if (editId) {

                const index =
                    db.tasks.findIndex(
                        item => item.id === editId
                    );

                db.tasks[index] = data;

                notify("Tarefa atualizada.");

            } else {

                db.tasks.push(data);

                notify("Tarefa adicionada.");

            }


            saveDatabase();

            closeModal();

            renderAll();

        });

}


function toggleTask(id) {

    const task =
        db.tasks.find(
            item => item.id === id
        );

    if (!task) return;

    task.completed =
        !task.completed;

    saveDatabase();

    renderAll();

}


function deleteTask(id) {

    if (!confirm(
        "Excluir esta tarefa?"
    )) return;

    db.tasks =
        db.tasks.filter(
            item => item.id !== id
        );

    saveDatabase();

    renderAll();

    notify("Tarefa excluída.");

}


function renderTasks() {

    const container =
        document.getElementById("tasksContainer");

    if (!container) return;


    let tasks =
        [...db.tasks];


    if (currentTaskFilter === "pending") {

        tasks =
            tasks.filter(
                task => !task.completed
            );

    }

    if (currentTaskFilter === "completed") {

        tasks =
            tasks.filter(
                task => task.completed
            );

    }

    if (currentTaskFilter === "high") {

        tasks =
            tasks.filter(
                task =>
                    task.priority === "high" &&
                    !task.completed
            );

    }


    if (!tasks.length) {

        container.innerHTML = `

            <div class="empty-state">

                <span>✅</span>

                <p>
                    Nenhuma tarefa encontrada.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        tasks.map(task => {

            const subject =
                db.subjects.find(
                    subject =>
                        subject.id === task.subjectId
                );


            return `

                <div class="task-card">

                    <div
                        class="task-check ${task.completed ? "completed" : ""}"
                        onclick="toggleTask('${task.id}')"
                    >
                        ${task.completed ? "✓" : ""}
                    </div>

                    <div class="task-content">

                        <h4>
                            ${escapeHTML(task.title)}
                        </h4>

                        <p>

                            ${subject
                                ? escapeHTML(subject.name)
                                : "Sem matéria"}

                            ${task.date
                                ? " • " + formatDate(task.date)
                                : ""}

                        </p>

                    </div>

                    <span class="priority ${task.priority}">

                        ${
                            task.priority === "high"
                                ? "ALTA"
                                : task.priority === "medium"
                                    ? "MÉDIA"
                                    : "BAIXA"
                        }

                    </span>

                    <button
                        class="small-button"
                        onclick="showTaskModal('${task.id}')"
                    >
                        ✎
                    </button>

                    <button
                        class="small-button"
                        onclick="deleteTask('${task.id}')"
                    >
                        🗑
                    </button>

                </div>

            `;

        }).join("");

}


/* filtros */

document
    .querySelectorAll("[data-task-filter]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        "[data-task-filter]"
                    )
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );

                button.classList.add("active");

                currentTaskFilter =
                    button.dataset.taskFilter;

                renderTasks();

            }
        );

    });


/* =========================================================
   AGENDA
========================================================= */

let calendarDate = new Date();


function showScheduleModal() {

    openModal(`

        <h2>
            Planejar estudo
        </h2>

        <form id="scheduleForm">

            <div class="form-group">

                <label>Matéria</label>

                <select id="scheduleSubject" required>

                    <option value="">
                        Selecione
                    </option>

                    ${db.subjects.map(subject => `

                        <option value="${subject.id}">
                            ${escapeHTML(subject.name)}
                        </option>

                    `).join("")}

                </select>

            </div>

            <div class="form-group">

                <label>Data</label>

                <input
                    id="scheduleDate"
                    type="date"
                    required
                >

            </div>

            <div class="form-group">

                <label>Horário</label>

                <input
                    id="scheduleTime"
                    type="time"
                    value="19:00"
                >

            </div>

            <div class="form-group">

                <label>Duração em minutos</label>

                <input
                    id="scheduleDuration"
                    type="number"
                    value="60"
                    min="5"
                >

            </div>

            <div class="form-actions">

                <button
                    type="button"
                    class="secondary-button"
                    onclick="closeModal()"
                >
                    Cancelar
                </button>

                <button
                    class="primary-button"
                    type="submit"
                >
                    Adicionar
                </button>

            </div>

        </form>

    `);


    document
        .getElementById("scheduleForm")
        .addEventListener("submit", event => {

            event.preventDefault();


            db.schedules.push({

                id: generateId(),

                subjectId:
                    document
                        .getElementById("scheduleSubject")
                        .value,

                date:
                    document
                        .getElementById("scheduleDate")
                        .value,

                time:
                    document
                        .getElementById("scheduleTime")
                        .value,

                duration:
                    Number(
                        document
                            .getElementById("scheduleDuration")
                            .value
                    )

            });


            saveDatabase();

            closeModal();

            renderAll();

            notify("Estudo planejado.");

        });

}


function renderCalendar() {

    const title =
        document.getElementById("calendarTitle");

    const daysContainer =
        document.getElementById("calendarDays");

    if (!title || !daysContainer) return;


    const year =
        calendarDate.getFullYear();

    const month =
        calendarDate.getMonth();


    const monthNames = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ];


    title.textContent =
        `${monthNames[month]} ${year}`;


    const firstDay =
        new Date(year, month, 1).getDay();

    const lastDate =
        new Date(year, month + 1, 0).getDate();


    const today =
        new Date();


    let html = "";


    for (let i = 0; i < firstDay; i++) {

        html += `
            <div class="calendar-day"></div>
        `;

    }


    for (let day = 1; day <= lastDate; day++) {

        const dateString =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


        const events =
            db.schedules.filter(
                schedule =>
                    schedule.date === dateString
            );


        const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;


        html += `

            <div
                class="calendar-day ${isToday ? "today" : ""}"
                onclick="selectCalendarDay('${dateString}')"
            >

                <div class="calendar-number">
                    ${day}
                </div>

                ${
                    events.map(event => {

                        const subject =
                            db.subjects.find(
                                item =>
                                    item.id === event.subjectId
                            );

                        return `

                            <div
                                class="calendar-event"
                            >
                                ${
                                    escapeHTML(
                                        subject?.name || "Estudo"
                                    )
                                }
                            </div>

                        `;

                    }).join("")
                }

            </div>

        `;

    }


    daysContainer.innerHTML = html;

}


function selectCalendarDay(date) {

    const schedules =
        db.schedules.filter(
            item => item.date === date
        );

    if (!schedules.length) {

        showScheduleModal();

        document
            .getElementById("scheduleDate").value =
            date;

        return;

    }


    const names =
        schedules.map(schedule => {

            const subject =
                db.subjects.find(
                    item =>
                        item.id === schedule.subjectId
                );

            return `${subject?.name || "Estudo"} às ${schedule.time}`;

        });


    alert(
        `Estudos em ${formatDate(date)}:\n\n` +
        names.join("\n")
    );

}


document
    .getElementById("previousMonth")
    .addEventListener("click", () => {

        calendarDate.setMonth(
            calendarDate.getMonth() - 1
        );

        renderCalendar();

    });


document
    .getElementById("nextMonth")
    .addEventListener("click", () => {

        calendarDate.setMonth(
            calendarDate.getMonth() + 1
        );

        renderCalendar();

    });


/* =========================================================
   CRONÔMETRO
========================================================= */

let timerInterval = null;

let timerSeconds = 0;

let timerRunning = false;


function updateTimerDisplay() {

    const hours =
        Math.floor(timerSeconds / 3600);

    const minutes =
        Math.floor(
            (timerSeconds % 3600) / 60
        );

    const seconds =
        timerSeconds % 60;


    document
        .getElementById("timerDisplay")
        .textContent =

        `${String(hours).padStart(2, "0")}:` +
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`;

}


document
    .getElementById("startTimer")
    .addEventListener("click", () => {

        if (timerRunning) return;

        timerRunning = true;

        timerInterval =
            setInterval(() => {

                timerSeconds++;

                updateTimerDisplay();

            }, 1000);

        notify("Cronômetro iniciado.");

    });


document
    .getElementById("pauseTimer")
    .addEventListener("click", () => {

        if (!timerRunning) return;

        clearInterval(timerInterval);

        timerRunning = false;

        notify("Cronômetro pausado.");

    });


document
    .getElementById("stopTimer")
    .addEventListener("click", () => {

        clearInterval(timerInterval);

        timerRunning = false;


        if (timerSeconds > 0) {

            const subjectId =
                document
                    .getElementById("timerSubject")
                    .value;


            db.studySessions.push({

                id: generateId(),

                subjectId,

                seconds: timerSeconds,

                date:
                    new Date()
                        .toISOString()
                        .split("T")[0],

                createdAt:
                    new Date().toISOString()

            });


            saveDatabase();

            notify(
                "Sessão de estudo registrada."
            );

        }


        timerSeconds = 0;

        updateTimerDisplay();

        renderAll();

    });


/* =========================================================
   HISTÓRICO
========================================================= */

function renderStudyHistory() {

    const container =
        document.getElementById("studyHistory");

    if (!container) return;


    const sessions =
        [...db.studySessions]
            .reverse()
            .slice(0, 10);


    if (!sessions.length) {

        container.innerHTML = `

            <div class="empty-state">

                <span>⏱️</span>

                <p>
                    Nenhuma sessão registrada.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        sessions.map(session => {

            const subject =
                db.subjects.find(
                    item =>
                        item.id === session.subjectId
                );


            return `

                <div class="task-card">

                    <div class="stat-icon blue">
                        ⏱️
                    </div>

                    <div class="task-content">

                        <h4>
                            ${escapeHTML(
                                subject?.name ||
                                "Estudo geral"
                            )}
                        </h4>

                        <p>
                            ${formatDate(session.date)}
                        </p>

                    </div>

                    <strong>
                        ${formatSeconds(session.seconds)}
                    </strong>

                </div>

            `;

        }).join("");

}


/* =========================================================
   METAS
========================================================= */

function showGoalModal(editId = null) {

    const goal =
        db.goals.find(
            item => item.id === editId
        );


    openModal(`

        <h2>
            ${goal ? "Editar meta" : "Nova meta"}
        </h2>

        <form id="goalForm">

            <div class="form-group">

                <label>Meta</label>

                <input
                    id="goalTitle"
                    required
                    value="${goal?.title || ""}"
                    placeholder="Ex: Estudar 30 horas"
                >

            </div>

            <div class="form-group">

                <label>Objetivo numérico</label>

                <input
                    id="goalTarget"
                    type="number"
                    min="1"
                    value="${goal?.target || 10}"
                >

            </div>

            <div class="form-group">

                <label>Unidade</label>

                <select id="goalUnit">

                    <option value="horas">
                        Horas
                    </option>

                    <option value="tarefas">
                        Tarefas
                    </option>

                    <option value="dias">
                        Dias
                    </option>

                    <option value="páginas">
                        Páginas
                    </option>

                </select>

            </div>

            <div class="form-actions">

                <button
                    type="button"
                    class="secondary-button"
                    onclick="closeModal()"
                >
                    Cancelar
                </button>

                <button
                    class="primary-button"
                    type="submit"
                >
                    Salvar
                </button>

            </div>

        </form>

    `);


    if (goal) {

        document
            .getElementById("goalUnit")
            .value = goal.unit;

    }


    document
        .getElementById("goalForm")
        .addEventListener("submit", event => {

            event.preventDefault();


            const data = {

                id: editId || generateId(),

                title:
                    document
                        .getElementById("goalTitle")
                        .value
                        .trim(),

                target:
                    Number(
                        document
                            .getElementById("goalTarget")
                            .value
                    ),

                unit:
                    document
                        .getElementById("goalUnit")
                        .value,

                current:
                    goal?.current || 0

            };


            if (editId) {

                const index =
                    db.goals.findIndex(
                        item => item.id === editId
                    );

                db.goals[index] = data;

            } else {

                db.goals.push(data);

            }


            saveDatabase();

            closeModal();

            renderAll();

            notify("Meta salva.");

        });

}


function deleteGoal(id) {

    if (!confirm("Excluir esta meta?"))
        return;

    db.goals =
        db.goals.filter(
            item => item.id !== id
        );

    saveDatabase();

    renderAll();

}


function renderGoals() {

    const container =
        document.getElementById("goalsContainer");

    if (!container) return;


    if (!db.goals.length) {

        container.innerHTML = `

            <div class="empty-state">

                <span>🎯</span>

                <p>
                    Nenhuma meta cadastrada.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        db.goals.map(goal => {

            const percentage =
                Math.min(
                    100,
                    Math.round(
                        (goal.current / goal.target) * 100
                    )
                );


            return `

                <div class="goal-card">

                    <h3>
                        ${escapeHTML(goal.title)}
                    </h3>

                    <p>
                        Meta de ${goal.target} ${goal.unit}
                    </p>

                    <div class="goal-value">
                        ${percentage}%
                    </div>

                    <div class="progress-bar">

                        <div
                            class="progress-fill"
                            style="width:${percentage}%"
                        ></div>

                    </div>

                    <div class="progress-info">

                        <span>
                            ${goal.current} / ${goal.target}
                        </span>

                        <span>
                            ${percentage}%
                        </span>

                    </div>

                    <div
                        style="
                            display:flex;
                            gap:8px;
                            margin-top:15px;
                        "
                    >

                        <button
                            class="small-button"
                            onclick="increaseGoal('${goal.id}')"
                        >
                            + Progresso
                        </button>

                        <button
                            class="small-button"
                            onclick="deleteGoal('${goal.id}')"
                        >
                            Excluir
                        </button>

                    </div>

                </div>

            `;

        }).join("");

}


function increaseGoal(id) {

    const goal =
        db.goals.find(
            item => item.id === id
        );

    if (!goal) return;

    goal.current++;

    if (goal.current > goal.target) {

        goal.current =
            goal.target;

    }

    saveDatabase();

    renderAll();

}


/* =========================================================
   ANOTAÇÕES
========================================================= */

function showNoteModal(editId = null) {

    const note =
        db.notes.find(
            item => item.id === editId
        );


    openModal(`

        <h2>
            ${note ? "Editar anotação" : "Nova anotação"}
        </h2>

        <form id="noteForm">

            <div class="form-group">

                <label>Título</label>

                <input
                    id="noteTitle"
                    required
                    value="${note?.title || ""}"
                    placeholder="Ex: Fórmula de matemática"
                >

            </div>

            <div class="form-group">

                <label>Anotação</label>

                <textarea
                    id="noteContent"
                    required
                    placeholder="Digite sua anotação..."
                >${note?.content || ""}</textarea>

            </div>

            <div class="form-actions">

                <button
                    type="button"
                    class="secondary-button"
                    onclick="closeModal()"
                >
                    Cancelar
                </button>

                <button
                    class="primary-button"
                    type="submit"
                >
                    Salvar
                </button>

            </div>

        </form>

    `);


    document
        .getElementById("noteForm")
        .addEventListener("submit", event => {

            event.preventDefault();


            const data = {

                id: editId || generateId(),

                title:
                    document
                        .getElementById("noteTitle")
                        .value
                        .trim(),

                content:
                    document
                        .getElementById("noteContent")
                        .value
                        .trim(),

                date:
                    new Date().toISOString()

            };


            if (editId) {

                const index =
                    db.notes.findIndex(
                        item => item.id === editId
                    );

                db.notes[index] = data;

            } else {

                db.notes.push(data);

            }


            saveDatabase();

            closeModal();

            renderAll();

            notify("Anotação salva.");

        });

}


function deleteNote(id) {

    if (!confirm("Excluir anotação?"))
        return;

    db.notes =
        db.notes.filter(
            item => item.id !== id
        );

    saveDatabase();

    renderAll();

}


function renderNotes() {

    const container =
        document.getElementById("notesGrid");

    if (!container) return;


    if (!db.notes.length) {

        container.innerHTML = `

            <div class="empty-state">

                <span>📝</span>

                <p>
                    Nenhuma anotação criada.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        db.notes.map(note => `

            <div class="note-card">

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        gap:10px;
                    "
                >

                    <h3>
                        ${escapeHTML(note.title)}
                    </h3>

                    <div>

                        <button
                            class="small-button"
                            onclick="showNoteModal('${note.id}')"
                        >
                            ✎
                        </button>

                        <button
                            class="small-button"
                            onclick="deleteNote('${note.id}')"
                        >
                            🗑
                        </button>

                    </div>

                </div>

                <p>
                    ${escapeHTML(note.content)}
                </p>

            </div>

        `).join("");

}


/* =========================================================
   ESTUDO RÁPIDO
========================================================= */

function showStudyModal() {

    showScheduleModal();

}


/* =========================================================
   DASHBOARD
========================================================= */

function renderDashboard() {

    document
        .getElementById("totalSubjects")
        .textContent =
        db.subjects.length;


    const totalSeconds =
        db.studySessions.reduce(
            (total, session) =>
                total + session.seconds,
            0
        );


    document
        .getElementById("totalHours")
        .textContent =
        formatHours(totalSeconds);


    document
        .getElementById("pendingTasks")
        .textContent =
        db.tasks.filter(
            task => !task.completed
        ).length;


    document
        .getElementById("completedGoals")
        .textContent =
        db.goals.filter(
            goal =>
                goal.current >= goal.target
        ).length;


    renderDashboardStudies();

    renderDashboardTasks();

    renderSubjectProgress();

}


/* próximos estudos */

function renderDashboardStudies() {

    const container =
        document.getElementById("dashboardStudies");

    if (!container) return;


    const schedules =
        [...db.schedules]
            .sort(
                (a,b) =>
                    `${a.date}${a.time}`
                        .localeCompare(
                            `${b.date}${b.time}`
                        )
            )
            .slice(0, 5);


    if (!schedules.length) {

        container.innerHTML = `

            <div class="empty-state">

                <span>📚</span>

                <p>
                    Nenhum estudo planejado.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        schedules.map(schedule => {

            const subject =
                db.subjects.find(
                    item =>
                        item.id === schedule.subjectId
                );


            return `

                <div class="task-card">

                    <div class="stat-icon blue">
                        📚
                    </div>

                    <div class="task-content">

                        <h4>
                            ${escapeHTML(
                                subject?.name || "Estudo"
                            )}
                        </h4>

                        <p>
                            ${formatDate(schedule.date)}
                            •
                            ${schedule.time}
                            •
                            ${schedule.duration} min
                        </p>

                    </div>

                </div>

            `;

        }).join("");

}


/* tarefas dashboard */

function renderDashboardTasks() {

    const container =
        document.getElementById("dashboardTasks");

    if (!container) return;


    const tasks =
        db.tasks
            .filter(task => !task.completed)
            .slice(0, 5);


    if (!tasks.length) {

        container.innerHTML = `

            <div class="empty-state">

                <span>✅</span>

                <p>
                    Tudo em dia!
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        tasks.map(task => `

            <div class="task-card">

                <div
                    class="task-check"
                    onclick="toggleTask('${task.id}')"
                ></div>

                <div class="task-content">

                    <h4>
                        ${escapeHTML(task.title)}
                    </h4>

                    <p>
                        ${
                            task.date
                                ? formatDate(task.date)
                                : "Sem prazo"
                        }
                    </p>

                </div>

            </div>

        `).join("");

}


/* progresso */

function renderSubjectProgress() {

    const container =
        document.getElementById("subjectProgress");

    if (!container) return;


    if (!db.subjects.length) {

        container.innerHTML = `

            <div class="empty-state">

                <span>📈</span>

                <p>
                    Cadastre matérias para acompanhar o progresso.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        db.subjects.map(subject => `

            <div style="margin-bottom:18px">

                <div
                    style="
                        display:flex;
                        justify-content:space-between;
                        margin-bottom:7px;
                        font-size:12px;
                    "
                >

                    <span>
                        ${escapeHTML(subject.name)}
                    </span>

                    <strong>
                        ${subject.progress}%
                    </strong>

                </div>

                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="
                            width:${subject.progress}%;
                            background:${subject.color};
                        "
                    ></div>

                </div>

            </div>

        `).join("");

}


/* =========================================================
   ESTATÍSTICAS
========================================================= */

function renderStatistics() {

    const totalSeconds =
        db.studySessions.reduce(
            (total, session) =>
                total + session.seconds,
            0
        );


    document
        .getElementById("statsTotalHours")
        .textContent =
        formatHours(totalSeconds);


    document
        .getElementById("statsCompletedTasks")
        .textContent =
        db.tasks.filter(
            task => task.completed
        ).length;


    const subjectSeconds = {};


    db.studySessions.forEach(session => {

        if (!session.subjectId) return;

        subjectSeconds[session.subjectId] =
            (subjectSeconds[session.subjectId] || 0) +
            session.seconds;

    });


    let mainSubject = null;

    let maxSeconds = 0;


    Object.entries(subjectSeconds)
        .forEach(([id, seconds]) => {

            if (seconds > maxSeconds) {

                maxSeconds = seconds;

                mainSubject =
                    db.subjects.find(
                        subject =>
                            subject.id === id
                    );

            }

        });


    document
        .getElementById("mainSubject")
        .textContent =
        mainSubject?.name || "-";


    calculateStreak();

    renderHoursChart();

}


function calculateStreak() {

    const dates =
        [
            ...new Set(
                db.studySessions.map(
                    session => session.date
                )
            )
        ].sort().reverse();


    let streak = 0;

    let current = new Date();


    for (const date of dates) {

        const expected =
            current
                .toISOString()
                .split("T")[0];


        if (date === expected) {

            streak++;

            current.setDate(
                current.getDate() - 1
            );

        } else {

            break;

        }

    }


    document
        .getElementById("studyStreak")
        .textContent =
        `${streak} ${streak === 1 ? "dia" : "dias"}`;

}


function renderHoursChart() {

    const container =
        document.getElementById("hoursChart");

    if (!container) return;


    const data =
        db.subjects.map(subject => {

            const seconds =
                db.studySessions
                    .filter(
                        session =>
                            session.subjectId === subject.id
                    )
                    .reduce(
                        (sum, session) =>
                            sum + session.seconds,
                        0
                    );


            return {

                name: subject.name,

                hours:
                    seconds / 3600

            };

        });


    if (!data.length) {

        container.innerHTML = `

            <div class="empty-state">
                <span>📊</span>
                <p>
                    Estude algumas matérias para visualizar seu gráfico.
                </p>
            </div>

        `;

        return;

    }


    const max =
        Math.max(
            ...data.map(item => item.hours),
            1
        );


    container.innerHTML =
        data.map(item => `

            <div
                class="chart-bar"
                style="
                    height:${Math.max(
                        10,
                        (item.hours / max) * 190
                    )}px;
                "
            >

                <span>
                    ${item.hours.toFixed(1)}h
                </span>

                <label>
                    ${escapeHTML(item.name)}
                </label>

            </div>

        `).join("");

}


/* =========================================================
   TIMER SUBJECTS
========================================================= */

function renderTimerSubjects() {

    const select =
        document.getElementById("timerSubject");

    if (!select) return;


    select.innerHTML = `

        <option value="">
            Estudo geral
        </option>

        ${
            db.subjects.map(subject => `

                <option value="${subject.id}">
                    ${escapeHTML(subject.name)}
                </option>

            `).join("")
        }

    `;

}


/* =========================================================
   TEMA
========================================================= */

document
    .getElementById("themeButton")
    .addEventListener("click", () => {

        document
            .body
            .classList.toggle("light");


        db.settings.theme =
            document.body.classList.contains("light")
                ? "light"
                : "dark";


        saveDatabase();

    });


function loadTheme() {

    if (
        db.settings.theme === "light"
    ) {

        document
            .body
            .classList.add("light");

    }

}


/* =========================================================
   LIMPAR DADOS
========================================================= */

document
    .getElementById("resetButton")
    .addEventListener("click", () => {

        const confirmed =
            confirm(
                "ATENÇÃO!\n\nIsso apagará todas as matérias, tarefas, metas, anotações e registros de estudo.\n\nDeseja continuar?"
            );


        if (!confirmed) return;


        localStorage.removeItem(DB_KEY);

        location.reload();

    });


/* =========================================================
   PESQUISA
========================================================= */

document
    .getElementById("subjectSearch")
    ?.addEventListener(
        "input",
        renderSubjects
    );


document
    .getElementById("subjectFilter")
    ?.addEventListener(
        "change",
        renderSubjects
    );


/* =========================================================
   FORMATADORES
========================================================= */

function formatDate(date) {

    if (!date) return "";

    const parts =
        date.split("-");

    if (parts.length !== 3)
        return date;

    return `${parts[2]}/${parts[1]}/${parts[0]}`;

}


function formatSeconds(seconds) {

    const h =
        Math.floor(seconds / 3600);

    const m =
        Math.floor(
            (seconds % 3600) / 60
        );

    const s =
        seconds % 60;


    if (h > 0) {

        return `${h}h ${m}min`;

    }

    return `${m}min ${s}s`;

}


function formatHours(seconds) {

    const hours =
        seconds / 3600;

    if (hours < 1) {

        const minutes =
            Math.floor(seconds / 60);

        return `${minutes}min`;

    }

    return `${hours.toFixed(1)}h`;

}


function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   RENDER GERAL
========================================================= */

function renderAll() {

    renderDashboard();

    renderSubjects();

    renderTasks();

    renderCalendar();

    renderStudyHistory();

    renderGoals();

    renderNotes();

    renderStatistics();

    renderTimerSubjects();

    updateTimerDisplay();

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

loadTheme();

renderAll();
document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const pages = {
        home: document.getElementById('home-page'),
        library: document.getElementById('library-page'),
        book: document.getElementById('book-page')
    };
    
    const navItems = document.querySelectorAll('.nav-item');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const booksContainer = document.getElementById('books-container');
    const favoritesContainer = document.getElementById('favorites-container');
    const bookDetailContainer = document.getElementById('book-detail');
    const backBtn = document.getElementById('back-btn');
    const pageTitle = document.getElementById('page-title');
    const filters = document.querySelectorAll('.filter-item');
    
    // Состояние приложения
    const state = {
        currentPage: 'home',
        currentQuery: '',
        currentFilter: 'all',
        currentBookId: null,
        books: [],
        authors: []
    };
    
    // Инициализация
    init();
    
    async function init() {
        // Загрузка списка книг
        await loadBookList();
        
        // Навигация
        setupNavigation();
        
        // Поиск
        setupSearch();
        
        // Фильтры
        setupFilters();
        
        // Кнопка назад
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo(state.currentPage === 'book' ? 'home' : 'library');
        });
    }
    
    async function loadBookList() {
        try {
            // В реальном приложении здесь будет запрос к серверу
            // Для демонстрации используем имитацию сканирования папки
            
            // Имитация структуры папок:
            // ./books/Автор/Название книги/book.fb2
            // ./books/Автор/Название книги/cover.jpg
            
            // В реальном приложении нужно использовать серверный код для сканирования папки
            // (как показано в предыдущем ответе)
            
            // Пример данных, соответствующих вашей структуре
            state.books = await simulateScanBooksFolder();
            state.authors = [...new Set(state.books.map(book => book.author))];
            
            renderBooks(state.books);
        } catch (error) {
            console.error('Ошибка загрузки книг:', error);
            booksContainer.innerHTML = '<p class="no-content">Не удалось загрузить список книг</p>';
        }
    }
    
    // Функция для имитации сканирования папки с книгами
    async function simulateScanBooksFolder() {
        // В реальном приложении это будет делать сервер
        // Здесь просто возвращаем пример данных
        
        return [
            {
                id: '1',
                author: 'Джек Лондон',
                title: 'Сердца трех',
                cover: 'books/Лондон  Джек/Сердца трех/Cердца трех.jpg',
                file: 'books/Лондон  Джек/Сердца трех/book.fb2',
                genre: 'fiction',
                description: 'Приключенческий роман Джека Лондона о поисках сокровищ и любви.'
            },
            {
                id: '2',
                author: 'Лондон Джек',
                title: 'Мартин Иден',
                cover: 'books/Лондон  Джек/Мартин Иден/Мартин Иден.jpg',
                file: 'books/Лондон  Джек/Мартин Иден/Мартин Иден - royallib.com.fb2',
                genre: 'fiction',
                description: 'Роман о становлении писателя и трагедии творческой личности.'
            },
            {
                id: '3',
                author: 'Достоевский Фёдор',
                title: 'Преступление и наказание',
                cover: 'books/Достоевский Фёдор/Преступление и наказание/Преступление и наказание.jpg',
                file: 'books/Достоевский Фёдор/Преступление и наказание/Преступление и наказание - royallib.com.fb2',
                genre: 'fiction',
                description: 'Философский роман о преступлении и моральной ответственности.'
            }
        ];
    }
    
    function setupNavigation() {
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Убираем активный класс у всех элементов
                navItems.forEach(navItem => navItem.classList.remove('active'));
                Object.values(pages).forEach(page => page.classList.remove('active'));
                
                // Добавляем активный класс текущему элементу
                this.classList.add('active');
                const pageId = this.getAttribute('data-page');
                document.getElementById(pageId).classList.add('active');
                
                // Обновляем состояние
                state.currentPage = pageId === 'home-page' ? 'home' : 'library';
                pageTitle.textContent = pageId === 'home-page' ? 'Онлайн библиотека' : 'Моя библиотека';
                backBtn.style.display = 'none';
                
                // Если переходим в библиотеку, обновляем список избранного
                if (pageId === 'library-page') {
                    loadFavorites();
                }
            });
        });
    }
    
    function setupSearch() {
        // Поиск книг
        searchBtn.addEventListener('click', function() {
            const query = searchInput.value.trim().toLowerCase();
            if (query) {
                state.currentQuery = query;
                filterBooks();
            } else {
                renderBooks(state.books);
            }
        });
        
        // Поиск при нажатии Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim().toLowerCase();
                if (query) {
                    state.currentQuery = query;
                    filterBooks();
                } else {
                    renderBooks(state.books);
                }
            }
        });
    }
    
    function setupFilters() {
        filters.forEach(filter => {
            filter.addEventListener('click', function() {
                filters.forEach(f => f.classList.remove('active'));
                this.classList.add('active');
                state.currentFilter = this.getAttribute('data-filter');
                filterBooks();
            });
        });
    }
    
    function filterBooks() {
        let filteredBooks = [...state.books];
        
        // Фильтрация по запросу
        if (state.currentQuery) {
            filteredBooks = filteredBooks.filter(book => 
                book.title.toLowerCase().includes(state.currentQuery) || 
                book.author.toLowerCase().includes(state.currentQuery)
            );
        }
        
        // Фильтрация по жанру
        if (state.currentFilter !== 'all') {
            filteredBooks = filteredBooks.filter(book => book.genre === state.currentFilter);
        }
        
        renderBooks(filteredBooks);
    }
    
    function navigateTo(page, bookId = null) {
        // Скрываем все страницы
        Object.values(pages).forEach(p => p.classList.remove('active'));
        navItems.forEach(item => item.classList.remove('active'));
        
        // Показываем нужную страницу
        if (page === 'home') {
            pages.home.classList.add('active');
            navItems[0].classList.add('active');
            pageTitle.textContent = 'Онлайн библиотека';
            backBtn.style.display = 'none';
            state.currentPage = 'home';
            filterBooks();
        } else if (page === 'library') {
            pages.library.classList.add('active');
            navItems[1].classList.add('active');
            pageTitle.textContent = 'Моя библиотека';
            backBtn.style.display = 'none';
            state.currentPage = 'library';
            loadFavorites();
        } else if (page === 'book') {
            pages.book.classList.add('active');
            pageTitle.textContent = 'Информация о книге';
            backBtn.style.display = 'block';
            state.currentPage = 'book';
            state.currentBookId = bookId;
            loadBookDetails(bookId);
        }
    }
    
    function renderBooks(books) {
        booksContainer.innerHTML = '';
        
        if (books.length > 0) {
            books.forEach(book => {
                createBookCard(book, booksContainer);
            });
        } else {
            booksContainer.innerHTML = '<p class="no-content">Книги не найдены. Попробуйте другой запрос.</p>';
        }
    }
    
    // Создание карточки книги
    function createBookCard(book, container) {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.addEventListener('click', function() {
            navigateTo('book', book.id);
        });
        
        // Проверяем, есть ли книга в избранном
        const isFavorite = localStorage.getItem(`favorite_${book.id}`) !== null;
        const hasBookmark = localStorage.getItem(`bookmark_${book.id}`) !== null;
        
        card.innerHTML = `
            <div class="book-cover" style="background-image: url('${book.cover || 'default-cover.jpg'}')">
                ${!book.cover ? '<i class="fas fa-book"></i>' : ''}
            </div>
            <div class="book-info">
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
                <div class="book-actions">
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-book-id="${book.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="bookmark-btn ${hasBookmark ? 'active' : ''}" data-book-id="${book.id}">
                        <i class="fas fa-bookmark"></i>
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
        
        // Обработчики для кнопок
        const favoriteBtn = card.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleFavorite(book);
        });
        
        const bookmarkBtn = card.querySelector('.bookmark-btn');
        bookmarkBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleBookmark(book);
        });
    }
    
    // Загрузка деталей книги
    function loadBookDetails(bookId) {
        const book = state.books.find(b => b.id === bookId);
        if (book) {
            renderBookDetails(book);
        } else {
            bookDetailContainer.innerHTML = '<p class="no-content">Книга не найдена</p>';
        }
    }
    
    // Отображение деталей книги
    function renderBookDetails(book) {
        // Проверяем, есть ли книга в избранном и закладках
        const isFavorite = localStorage.getItem(`favorite_${book.id}`) !== null;
        const bookmarkData = localStorage.getItem(`bookmark_${book.id}`);
        const hasBookmark = bookmarkData !== null;
        const bookmark = hasBookmark ? JSON.parse(bookmarkData) : null;
        
        bookDetailContainer.innerHTML = `
            <div class="book-detail-header">
                <div class="book-detail-cover" style="background-image: url('${book.cover || 'default-cover.jpg'}')">
                    ${!book.cover ? '<i class="fas fa-book"></i>' : ''}
                </div>
                <div class="book-detail-info">
                    <h1 class="book-detail-title">${book.title}</h1>
                    <div class="book-detail-author">${book.author}</div>
                    
                    <div class="book-detail-meta">
                        <span><i class="fas fa-tags"></i> ${book.genre || 'Не указан'}</span>
                    </div>
                    
                    <div class="book-detail-description">${book.description || 'Описание отсутствует.'}</div>
                    
                    <div class="book-detail-actions">
                        <button class="action-btn" id="read-btn">
                            <i class="fas fa-book-reader"></i> Читать
                        </button>
                        <button class="action-btn ${isFavorite ? 'secondary' : ''}" id="favorite-detail-btn">
                            <i class="fas fa-heart"></i> ${isFavorite ? 'В избранном' : 'В избранное'}
                        </button>
                        <button class="action-btn ${hasBookmark ? 'secondary' : ''}" id="bookmark-detail-btn">
                            <i class="fas fa-bookmark"></i> ${hasBookmark ? 'Закладка добавлена' : 'Добавить закладку'}
                        </button>
                    </div>
                    
                    ${hasBookmark ? `
                    <div class="bookmark-list">
                        <h3>Ваши закладки</h3>
                        <div class="bookmark-item" data-page="${bookmark.page}">
                            <strong>Страница ${bookmark.page}</strong><br>
                            <small>${new Date(bookmark.date).toLocaleString()}</small>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="reader-container" id="reader-container" style="display: none;">
                <div class="reader-content" id="reader-content">
                    <!-- Текст книги будет здесь -->
                </div>
            </div>
        `;
        
        // Обработчики событий
        document.getElementById('read-btn').addEventListener('click', function() {
            toggleReader(book);
        });
        
        document.getElementById('favorite-detail-btn').addEventListener('click', function() {
            toggleFavorite(book);
            this.innerHTML = `<i class="fas fa-heart"></i> ${!isFavorite ? 'В избранном' : 'В избранное'}`;
            this.classList.toggle('secondary');
        });
        
        document.getElementById('bookmark-detail-btn').addEventListener('click', function() {
            if (hasBookmark) {
                removeBookmark(book.id);
                this.innerHTML = '<i class="fas fa-bookmark"></i> Добавить закладку';
                this.classList.remove('secondary');
                document.querySelector('.bookmark-list')?.remove();
            } else {
                addBookmark(book.id);
                this.innerHTML = '<i class="fas fa-bookmark"></i> Закладка добавлена';
                this.classList.add('secondary');
            }
        });
        
        // Обработчик клика по закладке
        const bookmarkItem = document.querySelector('.bookmark-item');
        if (bookmarkItem) {
            bookmarkItem.addEventListener('click', function() {
                const pageNum = parseInt(this.getAttribute('data-page'));
                toggleReader(book, pageNum);
            });
        }
    }
    
    // Переключение читалки
    function toggleReader(book, pageNum = 1) {
        const readerContainer = document.getElementById('reader-container');
        const readerContent = document.getElementById('reader-content');
        
        if (readerContainer.style.display === 'none') {
            // Загрузка FB2 файла
            fetch(book.file)
                .then(response => {
                    if (!response.ok) throw new Error('Файл не найден');
                    return response.text();
                })
                .then(text => {
                    // Парсинг FB2 (упрощенный)
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(text, "text/xml");
                    
                    // Извлечение текста (упрощенный способ)
                    let bookText = '';
                    const bodies = xmlDoc.getElementsByTagName('body');
                    for (let i = 0; i < bodies.length; i++) {
                        bookText += bodies[i].textContent + '\n\n';
                    }
                    
                    // Отображение текста (с пагинацией)
                    const pages = bookText.split('\n\n').filter(p => p.trim().length > 0);
                    const pageToShow = Math.min(pageNum - 1, pages.length - 1);
                    
                    readerContent.innerHTML = `
                        <h2>${book.title}</h2>
                        <h3>${book.author}</h3>
                        <hr>
                        <p>${pages[pageToShow]}</p>
                        <p>Страница ${pageNum} из ${pages.length}</p>
                    `;
                    
                    readerContainer.style.display = 'block';
                })
                .catch(error => {
                    console.error('Ошибка загрузки книги:', error);
                    readerContent.innerHTML = `
                        <h2>${book.title}</h2>
                        <h3>${book.author}</h3>
                        <hr>
                        <p>Не удалось загрузить текст книги. FB2-файл не найден или поврежден.</p>
                        <p>Путь к файлу: ${book.file}</p>
                    `;
                    readerContainer.style.display = 'block';
                });
        } else {
            readerContainer.style.display = 'none';
        }
    }
    
    // Добавление/удаление из избранного
    function toggleFavorite(book) {
        const bookId = book.id;
        
        if (localStorage.getItem(`favorite_${bookId}`)) {
            localStorage.removeItem(`favorite_${bookId}`);
            
            // Обновляем кнопки в интерфейсе
            document.querySelectorAll(`.favorite-btn[data-book-id="${bookId}"]`).forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Если находимся на странице библиотеки, обновляем список
            if (state.currentPage === 'library') {
                loadFavorites();
            }
        } else {
            localStorage.setItem(`favorite_${bookId}`, JSON.stringify(book));
            
            // Обновляем кнопки в интерфейсе
            document.querySelectorAll(`.favorite-btn[data-book-id="${bookId}"]`).forEach(btn => {
                btn.classList.add('active');
            });
        }
    }
    
    // Добавление закладки
    function addBookmark(bookId) {
        const bookmark = {
            bookId: bookId,
            page: 1, // В реальном приложении это будет текущая страница
            date: new Date().toISOString()
        };
        localStorage.setItem(`bookmark_${bookId}`, JSON.stringify(bookmark));
        
        // Обновляем кнопки в интерфейсе
        document.querySelectorAll(`.bookmark-btn[data-book-id="${bookId}"]`).forEach(btn => {
            btn.classList.add('active');
        });
    }
    
    // Удаление закладки
    function removeBookmark(bookId) {
        localStorage.removeItem(`bookmark_${bookId}`);
        
        // Обновляем кнопки в интерфейсе
        document.querySelectorAll(`.bookmark-btn[data-book-id="${bookId}"]`).forEach(btn => {
            btn.classList.remove('active');
        });
    }
    
    // Переключение закладки
    function toggleBookmark(book) {
        const bookId = book.id;
        
        if (localStorage.getItem(`bookmark_${bookId}`)) {
            removeBookmark(bookId);
        } else {
            addBookmark(bookId);
        }
    }
    
    // Загрузка избранных книг
    function loadFavorites() {
        favoritesContainer.innerHTML = '';
        
        let hasFavorites = false;
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            
            if (key.startsWith('favorite_')) {
                hasFavorites = true;
                const bookData = JSON.parse(localStorage.getItem(key));
                createBookCard(bookData, favoritesContainer);
            }
        }
        
        if (!hasFavorites) {
            favoritesContainer.innerHTML = '<p class="no-content">У вас пока нет избранных книг.</p>';
        }
    }
});
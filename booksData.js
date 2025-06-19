/**
 * Имитирует сканирование папки с книгами и возвращает массив книг
 * @returns {Promise<Array>} Промис с массивом объектов книг
 */
export async function simulateScanBooksFolder() {
    // В реальном приложении это будет делать сервер
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
        
    ];
}
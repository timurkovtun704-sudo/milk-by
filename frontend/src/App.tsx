function App() {
  return (
    <main className="page">
      <header className="header">
        <a className="logo" href="/">Молочный Мир</a>
        <nav aria-label="Основная навигация">
          <a href="#catalog">Продукция</a>
          <a href="#about">О компании</a>
          <a href="#news">Новости</a>
          <a href="#contacts">Контакты</a>
        </nav>
      </header>

      <section className="hero">
        <p className="eyebrow">ОАО «Молочный Мир»</p>
        <h1>Вкус качества каждый день</h1>
        <p>Цифровая витрина молочной продукции. Каталог и информация о компании.</p>
        <a className="button" href="#catalog">Перейти в каталог</a>
      </section>

      <section id="catalog" className="placeholder-section">
        <h2>Каталог продукции</h2>
        <p>Здесь будет каталог товаров. Данные будут загружаться из Backend API.</p>
      </section>

      <section id="about" className="placeholder-section">
        <h2>О компании</h2>
        <p>Информационный раздел будет реализован в рамках задач Frontend-команды.</p>
      </section>

      <section id="news" className="placeholder-section">
        <h2>Новости</h2>
        <p>Здесь будут отображаться публикации компании.</p>
      </section>

      <footer id="contacts">
        <strong>Молочный Мир</strong>
        <span>Контактная информация будет добавлена после согласования с заказчиком.</span>
      </footer>
    </main>
  )
}

export default App

import React from 'react';
import * as BooksAPI from './BooksAPI';
import './App.css';

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
    searchedBooks: [],
    books: [],
  };

  async componentDidMount() {
    const allBooks = await BooksAPI.getAll();
    this.setState({ books: allBooks });
  }

  render() {
    const onSearch = async (event) => {
      const value = event.target.value;
      const books = !!value ? await BooksAPI.search(value) : [];

      if (books.error === 'empty query') return;
      this.setState({ searchedBooks: books });
    };

    const onShelfSelect = async (event, id) => {
      const value = event.target.value;
      await BooksAPI.update(id, value);
      const allBooks = await BooksAPI.getAll();
      this.setState({ books: allBooks });
    };

    return (
        <div className='app'>
          {this.state.showSearchPage ? (
              <div className='search-books'>
                <div className='search-books-bar'>
                  <button
                      className='close-search'
                      onClick={() => this.setState({ showSearchPage: false })}
                  >
                    Close
                  </button>
                  <div className='search-books-input-wrapper'>
                    {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                    <input
                        type='text'
                        placeholder='Search by title or author'
                        onChange={onSearch}
                    />
                    <div className='bookshelf-books'>
                      <ol className='books-grid'>
                        {this.state.searchedBooks.map((book) => (
                            <BookItem
                                key={book.id}
                                id={book.id}
                                thumbnail={
                                  book.imageLinks ? book.imageLinks.thumbnail : ''
                                }
                                title={book.title}
                                authors={book.authors}
                                shelf={book.shelf}
                                onShelfSelect={onShelfSelect}
                            />
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
                <div className='search-books-results'>
                  <ol className='books-grid' />
                </div>
              </div>
          ) : (
              <div className='list-books'>
                <div className='list-books-title'>
                  <h1>MyReads</h1>
                </div>
                <div className='list-books-content'>
                  <div>
                    <div className='bookshelf'>
                      <h2 className='bookshelf-title'>Currently Reading</h2>
                      <div className='bookshelf-books'>
                        <ol className='books-grid'>
                          {this.state.books
                              .filter((bk) => bk.shelf === 'currentlyReading')
                              .map((book) => {
                                return (
                                    <BookItem
                                        key={book.id}
                                        id={book.id}
                                        thumbnail={
                                          book.imageLinks ? book.imageLinks.thumbnail : ''
                                        }
                                        title={book.title}
                                        authors={book.authors}
                                        shelf={book.shelf}
                                        onShelfSelect={onShelfSelect}
                                    />
                                );
                              })}
                        </ol>
                      </div>
                    </div>
                    <div className='bookshelf'>
                      <h2 className='bookshelf-title'>Want to Read</h2>
                      <div className='bookshelf-books'>
                        <ol className='books-grid'>
                          {this.state.books
                              .filter((bk) => bk.shelf === 'wantToRead')
                              .map((book) => {
                                return (
                                    <BookItem
                                        key={book.id}
                                        id={book.id}
                                        thumbnail={
                                          book.imageLinks ? book.imageLinks.thumbnail : ''
                                        }
                                        title={book.title}
                                        authors={book.authors}
                                        shelf={book.shelf}
                                        onShelfSelect={onShelfSelect}
                                    />
                                );
                              })}
                        </ol>
                      </div>
                    </div>
                    <div className='bookshelf'>
                      <h2 className='bookshelf-title'>Read</h2>
                      <div className='bookshelf-books'>
                        <ol className='books-grid'>
                          {this.state.books
                              .filter((bk) => bk.shelf === 'read')
                              .map((book) => {
                                return (
                                    <BookItem
                                        key={book.id}
                                        id={book.id}
                                        thumbnail={
                                          book.imageLinks ? book.imageLinks.thumbnail : ''
                                        }
                                        title={book.title}
                                        authors={book.authors}
                                        shelf={book.shelf}
                                        onShelfSelect={onShelfSelect}
                                    />
                                );
                              })}
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='open-search'>
                  <button onClick={() => this.setState({ showSearchPage: true })}>
                    Add a book
                  </button>
                </div>
              </div>
          )}
        </div>
    );
  }
}

class BookItem extends React.Component {
  render() {
    const { thumbnail, title, authors, shelf, onShelfSelect, id } = this.props;

    return (
        <li>
          <div className='book'>
            <div className='book-top'>
              <div
                  className='book-cover'
                  style={{
                    width: 128,
                    height: 193,
                    backgroundImage: `url(${thumbnail})`,
                  }}
              />
              <div className='book-shelf-changer'>
                <select
                    defaultValue={shelf ? shelf : 'none'}
                    onChange={(e) => onShelfSelect(e, id)}
                >
                  <option value='move' disabled>
                    Move to...
                  </option>
                  <option value='currentlyReading'>Currently Reading</option>
                  <option value='wantToRead'>Want to Read</option>
                  <option value='read'>Read</option>
                  <option value='none'>None</option>
                </select>
              </div>
            </div>
            <div className='book-title'>{title}</div>
            <div className='book-authors'>{authors && authors.join()}</div>
          </div>
        </li>
    );
  }
}
//biography poetry
export default BooksApp;
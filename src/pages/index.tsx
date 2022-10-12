import { useState } from 'react';
import { GetStaticProps } from 'next';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { BsCalendarDate } from 'react-icons/bs';
import { IoMdPerson } from 'react-icons/io';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({
  postsPagination: { results, next_page },
}: HomeProps) {

  const [posts, setPosts] = useState<Post[]>(results);
  const [nextPage, setNextPage] = useState<string | null>(next_page);

  async function getNextPagePosts() {
    await fetch(nextPage)
      .then(response => response.json())
      .then(data => {
        const newPosts = posts;
        data.results.forEach((result: Post) => newPosts.push(result));
        setPosts(newPosts);
        setNextPage(data.next_page);
      });
  }

  return (
    <div className={styles.containerHome}>
      <div className={styles.contentHome}>
        <img src="logo.svg" alt="logo" />

        <div className={styles.containerPosts}>
          {posts.map(post => (
            <a href={`/post/${post.uid}`} key={post.uid}>
              <strong>{post.data.title}</strong>
              <p>{post.data.subtitle}</p>
              <div className={styles.timeAndAuthor}>
                <time>
                  <BsCalendarDate />{' '}
                  {format(
                    new Date(post.first_publication_date),
                    'dd MMM yyyy',
                    {
                      locale: ptBR,
                    }
                  )}
                </time>
                <span>
                  <IoMdPerson /> {post.data.author}
                </span>
              </div>
            </a>
          ))}
        </div>

        {!!nextPage && (
          <button
            type="button"
            className={styles.loadMore}
            onClick={getNextPagePosts}
          >
            Carregar mais...
          </button>
        )}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('blog', {
    orderings: {
      field: 'document.first_publication_date',
      direction: 'asc',
    },
    pageSize: 1,
    page: 1,
  });

  return {
    props: {
      postsPagination: postsResponse,
    },
  };
};

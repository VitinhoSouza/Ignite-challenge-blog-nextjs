import { GetStaticPaths, GetStaticProps } from 'next';
import { BsCalendarDate } from 'react-icons/bs';
import { IoMdPerson } from 'react-icons/io';
import { BiTimeFive } from 'react-icons/bi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';

import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  timeToRead?: number,
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const isLoading: boolean = post === undefined;
  return (
    <div className={styles.containerPagePost}>
      <Header />
      {isLoading ? (
        <div className={styles.containerPost}>Carregando...</div>
      ) : (
        <div className={styles.containerPost}>
          <img src={post.data.banner.url} alt={post.data.title} />

          <div className={styles.mainInfo}>
            <strong>{post.data.title}</strong>
            <div className={styles.timeAndAuthor}>
              <time>
                <BsCalendarDate />{' '}
                {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                  locale: ptBR,
                })}
              </time>
              <span>
                <IoMdPerson /> {post.data.author}
              </span>
              <time>
                <BiTimeFive />
                {post.timeToRead} min
              </time>
            </div>
          </div>

          {post.data.content.map(content => (
            <div className={styles.content}>
              <strong className={styles.heading}>{content.heading}</strong>
              <div
                className={styles.body}
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(content.body),
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  // const posts = await prismic.getByType('blog');

  return {
    paths: [
      {
        params: { slug: 'liga-quixadaense-de-futsal-encerrou-a-copa-crianca' },
      }, //If I want to generate some post statically in the build
    ],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('blog', String(slug));

  let wordsCount = 0;
  response.data.content.map(content => {
    wordsCount += content.heading.split(" ").length;
    content.body.map(body => {
      wordsCount += body.text.split(" ").length;
    })
  })

  return {
    props: {
      post: {
        ...response,
        timeToRead: (wordsCount/200).toFixed()
      }
    },
  };
};

"use client"

import { useEffect, useRef, useState, useCallback } from "react";
import ReadOnly from '@/components/ReadOnly';
import axios from "axios";
import BlogPostCardH from './blog-post-card-h';
import { useRouter } from 'next/navigation';
import { createEditor, Descendant } from 'slate'
import { Node } from 'slate'

export default function LazyLoad({mode, querystring}:{mode:string, querystring:string}) {
  const router = useRouter();

  const [items, setItems] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(1);

  const fetchData = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    if(mode == "search"){
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/article/search`, {
          search: querystring.replace(/%20/g, " "),
          page: index,
        })
        .then((res) => {
          setItems((prevItems: any) => [...prevItems, ...res.data.data]);
        })
        .catch((err) => console.log(err));
      setIndex((prevIndex) => prevIndex + 1);
    }else {

      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/article/${index}`)
        .then((res) => {
          setItems((prevItems:any) => [...prevItems, ...res.data.data]);
        })
        .catch((err) => console.log(err));
      setIndex((prevIndex) => prevIndex + 1);
    }

    setIsLoading(false);
  }, [index, isLoading]);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        if(mode == "search"){
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/article/search`,
            {
              search: querystring.replace(/%20/g, " "),
              page: 0
            }
          );
          setItems(response.data.data);
        } else {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/article/0`
          );
          setItems(response.data.data);

        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };

    getData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        fetchData();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchData]);

  const tval = useRef('')

  const generatePlainText = nodes => {
    return nodes.map(n => Node.string(n)).join('\n')
  }

  const formatDate = (datef:string) => {
    const date = new Date(datef);
    const options:any = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('id-ID', options);
    return formattedDate;
  }

  return (
    <div className='container'>
      <section className="py-12 container ">
        {
        items.map((e:any, i:number) => {
          let text : string = generatePlainText(e.content)
          if (text.length > 100) {
            text = text.substring(0, 100) + '...';
          }
          
            return (
              <>
              <div key={i} onClick={() => router.push(e.links.read)} className='cursor-pointer hover:-translate-y-2 transition-all ease-in mb-4 '>
                <BlogPostCardH name={e.author.name} date={formatDate(e.createdAt)} tags={e?.tags} title={e.title} desc={text} img={e?.cover || '/image/blogs/blog-1.png'}/>
              </div>
              </>
            )
        })
        }
      </section>
      {isLoading && <h1 className="text-center text-2xl my-4">Loading</h1>}
    </div>
  );
}


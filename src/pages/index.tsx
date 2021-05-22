import { SearchBar } from '@/components/index';
import Head from 'next/head';
import * as React from 'react';
import store from 'store2';
import { initialSuggestions } from 'src/utils';
import { isMobile } from 'react-device-detect';
import Fade from 'react-reveal/Fade';

//--------------------------------------
export const Home = (): JSX.Element => {
  const storedKey = store.has('wik');
  if (!storedKey) {
    store.set('wik', initialSuggestions);
  }
  storedKey;
  switch (isMobile) {
    case true:
      {
        //--------------------------------------hooks
        const [mobSearchfocused, setMobSearchfocused] = React.useState(false);
        React.useEffect(() => {
          if (document && mobSearchfocused) {
            //@ts-ignore
            document.body.querySelector('#bottom input')?.focus();
          }
        }, [mobSearchfocused]);
        return (
          <>
            <Head>
              <title>Find Meaning</title>
            </Head>
            <main
              className="relative grid w-full h-[93vh] place-items-center bg-blueGray-800"
              onClick={(e) => {
                e.stopPropagation();
                setMobSearchfocused(false);
              }}
            >
              <div className="w-full sm:w-[640px] px-2">
                <div className="center">
                  <h1 className="mb-2 text-2xl font-semibold text-center text-orange-700">
                    Find Meaning
                  </h1>
                  <span className="ml-1 text-xs text-blueGray-400">beta</span>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobSearchfocused(true);
                  }}
                  hidden={mobSearchfocused}
                >
                  <Fade bottom wait={100}>
                    <SearchBar pushRouter={true} />
                  </Fade>
                </div>
              </div>
              <div
                id="bottom"
                hidden={!mobSearchfocused}
                className="fixed bottom-0 z-10 w-full pt-1 bg-blueGray-800"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Fade bottom when={mobSearchfocused}>
                  <SearchBar pushRouter={true} />
                </Fade>
              </div>
            </main>
          </>
        );
      }
      break;

    default:
      return (
        <>
          <Head>
            <title>Find Meaning</title>
          </Head>
          <main className="relative grid w-full h-[93vh] place-items-center bg-blueGray-800">
            <div className="w-full sm:w-[640px]">
              <div className="center">
                <h1 className="mb-2 text-2xl font-semibold text-center text-orange-700">
                  Find Meaning
                </h1>
                <span className="ml-1 text-xs text-blueGray-400">beta</span>
              </div>
              <div></div>
              <Fade bottom wait={100}>
                <SearchBar pushRouter={true} />
              </Fade>
            </div>
          </main>
        </>
      );
      break;
  }
};

export default Home;

//http://localhost:3000/fileUpload
//http://localhost:3000/fileUpload

import React from 'react'

const Page = () => {
  return (
    <div>
       
    </div>
  )
}

export const getServerSideProps = async (appCtx) => {

  // const auth = await doCheckAuth(appCtx)
  // const { cookie } = appCtx.req.headers
  
  let auth = ''
  if (auth) {
    return {
      redirect: {
        destination: '/dashboard/home',
        permanent: false,
      },
    };

  } else {
    return {
      redirect: {
        destination: '/multifile2',
      }
    }
  }

  
  return {
    props: {
      data: [

      ],
      cookie: cookie ? cookie : null
    }
  }


}


export default Page

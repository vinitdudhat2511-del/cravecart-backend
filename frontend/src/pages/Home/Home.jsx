import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'
import DietFilter from '../../components/DietFilter/DietFilter'

const Home = () => {
  const [category, setCategory] = useState("All");
  const [dietTag, setDietTag] = useState("All");

  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <DietFilter dietTag={dietTag} setDietTag={setDietTag} />
      <FoodDisplay category={category} dietTag={dietTag} />
      <AppDownload />
    </div>
  )
}

export default Home

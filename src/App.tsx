import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { RecipeResponse } from './types';
import broccoliCoachImg from './assets/images/broccoli_coach_1782489202097.jpg';

export default function App() {
  const [foodItem, setFoodItem] = useState('');
  const [targetNutrient, setTargetNutrient] = useState('protein');
  const [targetAmount, setTargetAmount] = useState('45');
  
  const [loading, setLoading] = useState(false);
  const [recipeData, setRecipeData] = useState<RecipeResponse | null>(null);
  const [error, setError] = useState('');

  const funnyLoadingMessages = [
    "Consulting with the culinary gods...",
    "Crunching numbers and celery stalks...",
    "Arguing with a potato about macros...",
    "Doing advanced math on a chicken breast...",
    "Synthesizing maximum flavor...",
    "Measuring exactly one metric ton of sarcasm..."
  ];
  
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  const [mascotMessage, setMascotMessage] = useState("Hey there! I'm Coach Brocc! Tell me what you're craving, and I'll do the heavy lifting. Literally.");

  useEffect(() => {
    if (!recipeData && !loading) {
      if (targetNutrient === 'protein') {
        if (Number(targetAmount) > 100) setMascotMessage("Whoa, over 100g of protein?! Are you building a house out of muscles? 💪");
        else if (Number(targetAmount) >= 40) setMascotMessage("Solid protein goal! Let's get swole! 🥦");
        else setMascotMessage("Protein is king! Tell me what you want to eat.");
      } else if (targetNutrient === 'carbs') {
        if (Number(targetAmount) < 20) setMascotMessage("Low carb? We're running on fumes and dreams!");
        else setMascotMessage("Carbs equals energy! Let's fuel up for the marathon.");
      } else if (targetNutrient === 'fat') {
         setMascotMessage("Fat is flavor, baby! Don't fear the butter.");
      } else if (targetNutrient === 'calories') {
         if (Number(targetAmount) < 1000 && Number(targetAmount) > 0) setMascotMessage("That's a tiny meal! Are you feeding a squirrel?");
         else if (Number(targetAmount) > 3000) setMascotMessage("BULKING SEASON IS HERE! Let's feast!");
         else setMascotMessage("Counting calories? I prefer counting my bicep curls, but I can help.");
      }
    }
  }, [targetNutrient, targetAmount, recipeData, loading]);

  useEffect(() => {
    if (loading) {
       setMascotMessage(funnyLoadingMessages[loadingMsgIdx]);
    }
  }, [loading, loadingMsgIdx]);

  useEffect(() => {
     if (recipeData && !loading) {
        setMascotMessage("Boom! Recipe calculated. Check out these gains!");
     }
  }, [recipeData, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodItem || !targetAmount) return;

    setLoading(true);
    setError('');
    setRecipeData(null);
    
    const interval = setInterval(() => {
      setLoadingMsgIdx(prev => (prev + 1) % funnyLoadingMessages.length);
    }, 2000);

    try {
      const res = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodItem, targetNutrient, targetAmount: Number(targetAmount) })
      });

      if (!res.ok) {
        throw new Error('Failed to generate recipe. Is the API key set?');
      }

      const data = await res.json();
      setRecipeData(data);
    } catch (err: any) {
      setError(err.message || 'Something went horribly wrong.');
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const calculatePercentage = (value: number, total: number) => {
    if (!total || total === 0) return 0;
    return Math.min(100, Math.round((value / total) * 100));
  };

  const getEmojiForIngredient = (name: string) => {
    const lowercaseName = name.toLowerCase();
    if (lowercaseName.includes('egg')) return '🥚';
    if (lowercaseName.includes('bacon') || lowercaseName.includes('pork')) return '🥓';
    if (lowercaseName.includes('chicken') || lowercaseName.includes('poultry')) return '🍗';
    if (lowercaseName.includes('beef') || lowercaseName.includes('steak')) return '🥩';
    if (lowercaseName.includes('cheese') || lowercaseName.includes('dairy')) return '🧀';
    if (lowercaseName.includes('milk')) return '🥛';
    if (lowercaseName.includes('spinach') || lowercaseName.includes('lettuce') || lowercaseName.includes('greens')) return '🥬';
    if (lowercaseName.includes('tomato')) return '🍅';
    if (lowercaseName.includes('onion')) return '🧅';
    if (lowercaseName.includes('garlic')) return '🧄';
    if (lowercaseName.includes('potato')) return '🥔';
    if (lowercaseName.includes('carrot')) return '🥕';
    if (lowercaseName.includes('bread') || lowercaseName.includes('bun')) return '🍞';
    if (lowercaseName.includes('rice')) return '🍚';
    if (lowercaseName.includes('oil') || lowercaseName.includes('butter')) return '🧈';
    if (lowercaseName.includes('salt') || lowercaseName.includes('pepper') || lowercaseName.includes('spice')) return '🧂';
    return '🍽️';
  };

  return (
    <div className="min-h-screen bg-indigo-950 p-4 md:p-6 flex flex-col font-sans overflow-x-hidden selection:bg-lime-400 selection:text-indigo-950">
      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-lime-400 tracking-tighter uppercase italic">NutriNut 3000</h1>
            <p className="text-indigo-200 text-sm md:text-base font-medium">Because math is hard and eating is fun.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-indigo-900 border border-indigo-700 px-4 py-2 rounded-xl text-right hidden md:block">
              <span className="block text-[10px] text-indigo-400 uppercase font-bold tracking-widest">Current Mood</span>
              <span className="text-lime-300 font-bold">Aggressively Hungry</span>
            </div>
            <div className="bg-lime-400 text-indigo-950 px-6 py-2 rounded-xl font-black flex items-center shadow-[4px_4px_0px_#6366f1]">
              LET'S COOK
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-4 flex-grow">
          
          {/* Input/Search Area */}
          <section className="col-span-1 md:col-span-8 md:row-span-2 bg-indigo-800 border-2 border-indigo-500 rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden shadow-lg">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-lime-400/10 rounded-full blur-3xl"></div>
            
            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-4">
              <label className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2">What's the target, boss?</label>
              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="text" 
                  required
                  value={foodItem}
                  onChange={e => setFoodItem(e.target.value)}
                  placeholder="E.g. The 'I'm feeling lazy' Omelette" 
                  className="flex-grow bg-indigo-900 border-2 border-indigo-400 rounded-2xl px-6 py-4 text-xl font-bold text-white placeholder-indigo-500 outline-none focus:border-lime-400 transition-colors"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-lime-400 text-indigo-950 font-black px-8 py-4 md:py-0 rounded-2xl hover:bg-lime-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-[4px_4px_0px_#6366f1] active:shadow-[0px_0px_0px_#6366f1] active:translate-y-1 active:translate-x-1"
                >
                  {loading ? 'CALCULATING...' : 'CALCULATE'}
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-4 md:gap-6 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400 text-sm font-bold uppercase tracking-wide">Target</span>
                  <select 
                    value={targetNutrient}
                    onChange={e => setTargetNutrient(e.target.value)}
                    className="bg-indigo-900 border border-indigo-400 rounded-lg px-2 py-1 text-lime-400 font-bold outline-none"
                  >
                    <option value="protein">Protein</option>
                    <option value="carbs">Carbs</option>
                    <option value="fat">Fat</option>
                    <option value="calories">Calories</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400 text-sm font-bold uppercase tracking-wide">Goal:</span>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={targetAmount}
                    onChange={e => setTargetAmount(e.target.value)}
                    className="w-20 bg-indigo-900 border border-indigo-400 rounded-lg px-2 py-1 text-lime-400 font-bold text-center outline-none"
                  />
                  <span className="text-indigo-400 text-sm font-bold">{targetNutrient === 'calories' ? 'kcal' : 'grams'}</span>
                </div>
                <div className="hidden md:block h-6 w-[2px] bg-indigo-700"></div>
                <span className="text-indigo-300 text-sm italic">"Warning: May lead to spontaneous flexing."</span>
              </div>
            </form>
          </section>

          {/* Mascot Area */}
          <section className="col-span-1 md:col-span-4 md:row-span-2 bg-indigo-900 border-2 border-lime-400 rounded-3xl p-4 flex flex-col md:flex-row items-center md:items-start gap-4 relative overflow-hidden shadow-[4px_4px_0px_#a3e635]">
            <div className="w-20 h-20 md:w-24 md:h-24 min-w-[5rem] md:min-w-[6rem] rounded-2xl overflow-hidden border-2 border-lime-400 bg-white flex-shrink-0">
              <img src={broccoliCoachImg} alt="Coach Brocc" className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow flex flex-col items-center md:items-start text-center md:text-left justify-center h-full">
              <span className="text-lime-400 font-black uppercase text-xs mb-1 tracking-widest bg-lime-400/10 px-2 py-1 rounded-lg">Coach Brocc</span>
              <AnimatePresence mode="wait">
                <motion.p 
                  key={mascotMessage}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-white font-bold text-sm md:text-sm leading-tight italic"
                >
                  "{mascotMessage}"
                </motion.p>
              </AnimatePresence>
            </div>
          </section>

          {/* Error State */}
          {error && (
            <section className="col-span-1 md:col-span-12 bg-red-500 rounded-3xl p-6 text-white font-bold text-center shadow-[4px_4px_0px_#7f1d1d]">
              ⚠️ {error}
            </section>
          )}

          {/* Loading State Overlay */}
          {loading && !recipeData && (
             <section className="col-span-1 md:col-span-12 md:row-span-4 bg-indigo-900/50 rounded-3xl p-12 flex flex-col items-center justify-center border-2 border-indigo-700 border-dashed">
                <Loader2 size={48} className="text-lime-400 animate-spin mb-4" />
                <p className="text-xl text-indigo-300 font-bold animate-pulse">Cooking up your macros...</p>
             </section>
          )}

          {/* Funny Macro Breakdown */}
          {recipeData && (
            <section className="col-span-1 md:col-span-4 md:row-span-6 bg-lime-400 rounded-3xl p-6 flex flex-col justify-between shadow-[8px_8px_0px_#312e81]">
              <div>
                <h3 className="text-indigo-950 font-black text-3xl uppercase italic leading-none mb-6">The Numbers<br/>(Don't Cry)</h3>
                
                <div className="space-y-6">
                  <div className="border-b-2 border-indigo-950/20 pb-4">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-indigo-900 font-bold">Swole Factor (Protein)</span>
                      <span className="text-4xl font-black text-indigo-950">{recipeData.macros.protein}g</span>
                    </div>
                    <div className="w-full bg-indigo-950/20 h-3 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${calculatePercentage(recipeData.macros.protein, targetNutrient === 'protein' ? Number(targetAmount) : 100)}%` }}
                        className="bg-indigo-950 h-full rounded-full" 
                      />
                    </div>
                  </div>
                  
                  <div className="border-b-2 border-indigo-950/20 pb-4">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-indigo-900 font-bold">Brain Juice (Carbs)</span>
                      <span className="text-4xl font-black text-indigo-950">{recipeData.macros.carbs}g</span>
                    </div>
                    <div className="w-full bg-indigo-950/20 h-3 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${calculatePercentage(recipeData.macros.carbs, targetNutrient === 'carbs' ? Number(targetAmount) : 100)}%` }}
                        className="bg-indigo-950 h-full rounded-full" 
                      />
                    </div>
                  </div>
                  
                  <div className="pb-2">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-indigo-900 font-bold">Lube for the Soul (Fat)</span>
                      <span className="text-4xl font-black text-indigo-950">{recipeData.macros.fat}g</span>
                    </div>
                    <div className="w-full bg-indigo-950/20 h-3 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${calculatePercentage(recipeData.macros.fat, targetNutrient === 'fat' ? Number(targetAmount) : 100)}%` }}
                        className="bg-indigo-950 h-full rounded-full" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-indigo-950 text-white p-4 rounded-2xl text-center font-bold text-lg shadow-inner">
                TOTAL: {recipeData.macros.calories} CALORIES OF GLORY
              </div>
            </section>
          )}

          {/* Ingredient Requirements */}
          {recipeData && (
            <section className="col-span-1 md:col-span-5 md:row-span-4 bg-white rounded-3xl p-6 flex flex-col shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-indigo-950 font-black text-xl md:text-2xl uppercase">{recipeData.recipeName}</h3>
                <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-2">
                  {recipeData.ingredients.length} ITEMS REQ.
                </span>
              </div>
              <div className="space-y-3 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                  {recipeData.ingredients.map((ing, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-2 border-indigo-50 rounded-2xl hover:border-indigo-200 transition-colors gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 min-w-[40px] bg-indigo-50 rounded-full flex items-center justify-center text-xl">
                          {getEmojiForIngredient(ing.name)}
                        </div>
                        <div className="flex flex-col leading-tight">
                          <span className="font-bold text-indigo-900 text-sm sm:text-base">
                            <span className="text-indigo-600 mr-1">{ing.amount}{ing.unit}</span> 
                            {ing.name}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-indigo-400 sm:text-right italic bg-indigo-50/50 px-2 py-1 rounded self-start sm:self-auto ml-12 sm:ml-0">
                        {ing.notes}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <p className="mt-4 text-[11px] text-indigo-400 font-medium leading-tight pt-2 border-t border-indigo-50">
                Calculated precisely to meet your {targetAmount}{targetNutrient === 'calories' ? 'kcal' : 'g'} {targetNutrient} goal. {recipeData.funnyDescription}
              </p>
            </section>
          )}

          {/* Health Effects / Roasts */}
          {recipeData && (
            <section className="col-span-1 md:col-span-3 md:row-span-2 bg-indigo-500 rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden shadow-lg">
              <div className="absolute top-2 right-4 text-4xl opacity-20">🩺</div>
              <h4 className="text-indigo-950 font-black text-sm uppercase mb-3">The Doctor's Verdict</h4>
              <div className="space-y-2 relative z-10 overflow-y-auto">
                <p className="text-white font-bold leading-tight text-sm">
                  {recipeData.healthEffects[0] || "Your muscles are currently throwing a party."}
                </p>
                {recipeData.healthEffects[1] && (
                  <p className="text-indigo-200 font-medium leading-tight text-xs mt-2">
                    {recipeData.healthEffects[1]}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Vibe Check */}
          {recipeData && (
            <section className="col-span-1 md:col-span-3 md:row-span-2 bg-pink-500 rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden shadow-lg">
              <div className="absolute top-2 right-4 text-4xl opacity-20">⚡</div>
              <h4 className="text-pink-950 font-black text-sm uppercase mb-3">Vibe Check</h4>
              <p className="text-white font-bold leading-tight uppercase text-sm relative z-10">
                {recipeData.healthEffects[2] || "10/10 Flavor Profile. Your tastebuds just got a promotion. Go forth and digest."}
              </p>
            </section>
          )}

        </main>

        {/* Footer Bar */}
        <footer className="mt-6 flex justify-between items-center border-t border-indigo-800 pt-4 pb-2">
          <div className="flex gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-indigo-400 text-[10px] md:text-xs font-bold uppercase">DATABASE: SYNCED</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-lime-400"></div>
              <span className="text-indigo-400 text-[10px] md:text-xs font-bold uppercase hidden md:inline-block">CALORIES: ACCURATE-ISH</span>
            </div>
          </div>
          <span className="text-indigo-600 text-[10px] md:text-xs font-black tracking-widest uppercase">Build Version: Lettuce-v2.1.0</span>
        </footer>
      </div>
    </div>
  );
}


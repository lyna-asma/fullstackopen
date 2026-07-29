import { create } from 'zustand'

const useStatisticsStore = create((set, get) => ({
  good: 0,
  neutral: 0,
  bad: 0,

  goodIncrement: () => set((state) => ({ good: state.good + 1 })),
  neutralIncrement: () => set((state) => ({ neutral: state.neutral + 1 })),
  badIncrement: () => set((state) => ({ bad: state.bad + 1 })),

  // not stored — computed fresh every time it's called
  average: () => {
    const { good, bad, all } = get()
    // all() is itself a function here, so call it
    const total = all()
    if (total === 0) return 0
    return (good - bad) / total
  },

  all: () => {
    const { good, neutral, bad } = get()
    return good + neutral + bad
  },
}))

export {useStatisticsStore} 
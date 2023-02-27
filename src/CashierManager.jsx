import { useReducer, useRef, useEffect } from 'react'
import CashierList from './CashierList'
import "./CashierManager.css"

export const ACTION_TYPE = {
  SCAN_QUEUE: 'scan_queue',
  PUSH_QUEUE: 'push_queue',
  TOGGLE_CASHIER: 'toggle_cashier',
}

class Customer {
  constructor({ name, itemCount, id }) {
    this.id = id || new Date().getTime() + Math.floor(Math.random() * 999999)
    this.name = name || 'Anonymous'
    this.itemCount = itemCount || 1
  }
  setName(name) {
    this.name = name
  }
  setItemCount(itemCount) {
    this.itemCount = itemCount
  }
  getName() {
    return this.name
  }
  getItemCount() {
    return this.itemCount
  }
}

class Cashier {
  constructor({ name, queue, speed, id, isAvailable }) {
    this.id = id || new Date().getTime() + Math.floor(Math.random() * 999999)
    this.name = name || 'Cashier'
    this.queue = queue || []
    this.speed = speed || Math.floor(100 + Math.random() * 900)
    this.isAvailable = typeof isAvailable !== 'undefined' ? isAvailable : true,
    this.isShifting = false
  }
  pushQueue(queue) {
    this.queue.push(queue)
  }
  shiftQueue() {
    if(this.isShifting) {
        setTimeout(() => {
            this.queue.shift()
            this.isShifting = false
        },1000)
    }
  }
  scanQueue() {
    if (this.queue.length > 0) {
        if (this.queue[0].getItemCount() > 0)
            this.queue[0].setItemCount(this.queue[0].getItemCount() - 1)
        if (this.queue[0].getItemCount() <= 0 && !this.isShifting) {
            this.isShifting = true
            this.shiftQueue()
        }
    }
  }
  setSpeed(speed) {
    this.speed = speed
  }
  setName(name) {
    this.name = name
  }
  setIsAvailable(isAvailable) {
    this.isAvailable = isAvailable
  }
  getName() {
    return this.name
  }
  getSpeed() {
    return this.speed
  }
  getId() {
    return this.id
  }
  getQueue() {
    return this.queue
  }
  getIsAvailable() {
    return this.isAvailable
  }
  getTotalQueue() {
    return this.queue
      .map((q) => q.itemCount)
      .reduce(
        (accumulator, currentValue) =>
          parseInt(accumulator) + parseInt(currentValue),
        0,
      )
  }
}

function reducer(cashierList, action) {
  switch (action.type) {
    case ACTION_TYPE.PUSH_QUEUE:
        let availableCashier = cashierList.filter((cashier) => cashier.getIsAvailable())
        if(availableCashier.length > 0) {
            let totalQueueList = availableCashier
                .map((cashier) => ({
                id: cashier.id,
                time:
                    (cashier.getTotalQueue() + action.payload.queue.getItemCount()) /
                    (1000 / cashier.getSpeed()),
                }))
                .sort((a, b) => a.time - b.time)
            let minQueueId = totalQueueList[0].id
            return cashierList.map((cashier) => {
                if (cashier.id === minQueueId) {
                cashier.pushQueue(action.payload.queue)
                }
                return cashier
            })
        }
        return cashierList
    case ACTION_TYPE.SCAN_QUEUE:
      return cashierList.map((cashier) => {
        if (cashier.id === action.payload.id) {
          cashier.scanQueue()
        }
        return cashier
      })
    case ACTION_TYPE.TOGGLE_CASHIER:
        return cashierList.map((cashier) => {
            if (cashier.id === action.payload.id) {
              cashier.setIsAvailable(!cashier.getIsAvailable())
            }
            return cashier
          })
    default:
      return cashierList
  }
}

const DEFAULT_NAMES = [
  'Gertie',
  'Clauddetta',
  'Caesar',
  'Bow',
  'Tova',
  'Shilpa',
  'Robena',
  'Parth',
  'Tyeshia',
  'Cera',
  'Marsiella',
  'Kaneshia',
  'Amen',
  'Renae',
  'Dwyer',
  'Zoldi',
  'Wanonah',
  'Lacombe',
  'Melynda',
  'Jovonna',
  'Reube',
  'Dasha',
  'Pierette',
  'Cochrane',
  'Margues',
  'Rhandi',
  'Ferdie',
  'Garibull',
  'Shamra',
  'Christorpher',
  'Cully',
  'Healey',
  'Tristan',
  'Frederiksen',
  'Morley',
  'Helban',
  'Azusena',
  'Crespi',
  'Pasco',
  'Annika',
  'Kenon',
  'Lavonte',
  'Marshawn',
  'Lorenna',
  'Coates',
  'Senecal',
  'Galen',
  'Ed',
  'Boeke',
  'Atlante',
  'Eduino',
  'Karlis',
  'Maximiliano',
  'Mellanie',
  'Devorah',
  'Veronica',
  'Ciaira',
  'Queston',
  'Packston',
  'Latoya',
  'Olathe',
  'Derayne',
  'Deragon',
  'Joannie',
  'Mutz',
  'Alfreda',
  'Audrina',
  'Acey',
  'Shiketa',
  'Josue',
  'Whitby',
  'Ly',
  'Chandelle',
  'Jaquis',
  'Breann',
  'Quana',
  'Amrit',
  'Cleofas',
  'Gretta',
  'Lundquist',
  'Roxanna',
  'Jammin',
  'Rod',
  'Manny',
  'Reed',
  'Shamica',
  'Isaac',
  'Bullen',
  'Mary',
  'Syreeta',
  'Okun',
  'Filippo',
  'Joshaua',
  'Whitman',
  'Somnang',
  'Ruthi',
  'Gianfranco',
  'Domel',
  'Dombrowski',
  'Grantham',
]

function generateName() {
  return `${
    DEFAULT_NAMES[Math.floor(Math.random() * (DEFAULT_NAMES.length - 1))]
  } ${
    DEFAULT_NAMES[Math.floor(Math.random() * (DEFAULT_NAMES.length - 1))]
  }`
}

export default function CashierManager() {
  const [cashierList, dispatch] = useReducer(reducer, [
    new Cashier({ name: 'Cashier#1' }),
    new Cashier({ name: 'Cashier#2' }),
    new Cashier({ name: 'Cashier#3', isAvailable: false }),
    new Cashier({ name: 'Cashier#4' }),
    new Cashier({ name: 'Cashier#5' }),
    new Cashier({ name: 'Cashier#6' }),
    new Cashier({ name: 'Cashier#7' }),
    new Cashier({ name: 'Cashier#8', isAvailable: false }),
    new Cashier({ name: 'Cashier#9' }),
    new Cashier({ name: 'Cashier#10' }),
  ])

  const queue = useRef(0)

  function handleForm(e) {
    e.preventDefault()
    if (queue.current.value > 0) {
      dispatch({
        type: ACTION_TYPE.PUSH_QUEUE,
        payload: { 
            queue: new Customer({ name: generateName(), itemCount: queue.current.value })
        },
      })

    //   queue.current.value = 0
    }
  }

  const CUSTOMER_FREQUENCY = .2
  let customerRando = Math.random()
  const MAX_CUSTOMER_BATCH = Math.floor(cashierList.length / 2)

  useEffect(() => {
    const intervalParent = setInterval(() => {
      // random customer arrive to cashier controller
      if (CUSTOMER_FREQUENCY >= customerRando) {
        for(let i = 0 ; i < Math.floor(Math.random() * MAX_CUSTOMER_BATCH) ; i++) {
            dispatch({
            type: ACTION_TYPE.PUSH_QUEUE,
            payload: { 
                queue: new Customer({ name: generateName(), itemCount: Math.floor(1 + Math.random() * 49) })  },
            })
        }
      }
      customerRando = Math.random()
    }, 1000)
    return () => clearInterval(intervalParent)
  }, [])

  return (
    <>
      <div className="cm-container">
        <form className="cm-form" onSubmit={handleForm}>
          <div className="cm-input-group">
            <input type="number" className="cm-input" ref={queue} placeholder="Jumlah Barang" />
            <button className="cm-button">Checkout</button>
          </div>
        </form>
      </div>

      <CashierList cashierList={cashierList} dispatch={dispatch} />
    </>
  )
}

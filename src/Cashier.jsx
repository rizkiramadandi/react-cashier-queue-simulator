import { useEffect } from "react"
import { ACTION_TYPE } from "./CashierManager"
import "./Cashier.css"
import ProfileIcon from "./assets/profile-icon.svg"

export default function Cashier({ cashier, dispatch }) {

    useEffect(() => {
        console.log(cashier.name, "triggered")
        const intervalParent = setInterval(() => {
            dispatch({ type: ACTION_TYPE.SCAN_QUEUE, payload: { id: cashier.id } })
            if(cashier.getTotalQueue() <= 0) {
                clearInterval(intervalParent)
            }
        }, cashier.getSpeed())
        return () => clearInterval(intervalParent)
    }, [cashier.getTotalQueue() > 0])

    return (
        <>
            <div className="c-container">
                <div className="c-info-container">
                    <div className="c-name">
                        { cashier.getName() }
                    </div>
                    <div className="c-speed">
                        Scan Speed: { cashier.getSpeed() }ms
                    </div>
                    <div role="button" className="c-availability-container" onClick={ () => dispatch({ type: ACTION_TYPE.TOGGLE_CASHIER, payload: { id: cashier.id } }) }>
                        { (cashier.getIsAvailable()) ? (<div className="c-availability c-open">Open</div>):(<div className="c-availability c-closed">Closed</div>) }
                    </div>
                </div>
                <div className="c-queue-container">
                    { cashier.getQueue().map(queue => {
                        return (
                            <div key = { queue.id } className={ `c-queue` + (queue.itemCount <= 0 ? ` finish`:`` ) }>
                                <img src={ ProfileIcon } alt="Profile Icon" />
                                <div className="cq-item">
                                    { queue.itemCount }
                                </div>

                                <div className="cq-name">
                                    { queue.name }
                                </div>
                            </div>
                        )
                    }) }
                </div>
            </div>
        </>
    )
}
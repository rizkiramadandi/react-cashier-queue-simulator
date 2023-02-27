import Cashier from "./Cashier"
import "./CashierList.css"

export default function CashierList({ cashierList, dispatch }) {
    return (
        <>
            <div className="cl-container">
                { cashierList.map(cashier => {
                    return (
                        <Cashier key = { cashier.getId() } cashier = { cashier } dispatch = { dispatch } />
                    )
                }) }
            </div>
        </>
    )
}
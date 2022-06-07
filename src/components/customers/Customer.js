import { Link } from "react-router-dom"

export const Customer = ({ id, fullName, address, phoneNumber }) => {
    return <section className="employee">
    <div>
        <Link to={`/customers/${id}`}>Name: {fullName}</Link>
    </div>
    <div>Address: {address}</div>
    <div>Phone Number: {phoneNumber}</div>
</section>
}

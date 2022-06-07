import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./tickets.css";

export const TicketList = ({ searchTermState }) => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [emergency, setEmergency] = useState(false);
  const [openOnly, updateOpenOnly] = useState(false);

  const localHoneyUser = localStorage.getItem("honey_user");
  const honeyUserObject = JSON.parse(localHoneyUser);
  const navigate = useNavigate();

  useEffect(() => {
    const searchedTickets = tickets.filter((ticket) => {
      return ticket.description
        .toLowerCase()
        .startsWith(searchTermState.toLowerCase());
    });
    setFilteredTickets(searchedTickets);
  }, [ searchTermState ]);

  useEffect(() => {
    if (emergency) {
      const emergencies = tickets.filter((ticket) => ticket.emergency === true);
      setFilteredTickets(emergencies);
    } else {
      setFilteredTickets(tickets);
    }
  }, [emergency]);

  useEffect(() => {
    if (openOnly) {
      const openTicketArray = tickets.filter((ticket) => {
        return (
          ticket.userId == honeyUserObject.id && ticket.dateCompleted === ""
        );
      });
      setFilteredTickets(openTicketArray);
    } else {
      const myTickets = tickets.filter(
        (ticket) => ticket.userId === honeyUserObject.id
      );
      setFilteredTickets(myTickets);
    }
  }, [openOnly]);
  useEffect(
    () => {
      fetch(` http://localhost:8088/serviceTickets`)
        .then((response) => response.json())
        .then((ticketsArray) => {
          setTickets(ticketsArray);
        });
    },
    [] // When this array is empty, you are observing initial component state
  );

  useEffect(() => {
    if (honeyUserObject.staff) {
      setFilteredTickets(tickets);
    } else {
      const myTickets = tickets.filter(
        (ticket) => ticket.userId === honeyUserObject.id
      );
      setFilteredTickets(myTickets);
    }
  }, [tickets]);
  return (
    <>
      {honeyUserObject.staff ? (
        <>
          <button
            onClick={() => {
              setEmergency(true);
            }}
          >
            Emergency Only
          </button>
          <button
            onClick={() => {
              setEmergency(false);
            }}
          >
            Show All
          </button>
        </>
      ) : (
        <>
          <button onClick={() => navigate("/ticket/create")}>
            Create Ticket
          </button>
          <button onClick={() => updateOpenOnly(true)}>Open Ticket</button>
          <button onClick={() => updateOpenOnly(false)}>All My Tickets</button>
        </>
      )}
      <h2>List of Tickets</h2>

      <article className="tickets">
        {filteredTickets.map((ticket) => {
          return (
            <section className="ticket" key={`ticket--${ticket.id}`}>
              <header>
                <Link to={`/tickets/${ticket.id}/edit`}>Ticket {ticket.id}</Link>
              </header>
              <section>{ticket.description}</section>
              <footer>Emergency: {ticket.emergency ? "🧨" : "No"}</footer>
            </section>
          );
        })}
      </article>
    </>
  );
};

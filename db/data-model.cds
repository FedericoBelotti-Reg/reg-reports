using {
    cuid,
    managed
} from '@sap/cds/common';

using {API_TICKETS as api} from '../srv/external/API_TICKETS';

namespace regesta.cap.reports;

@readonly
entity Tickets as
    projection on api.vwTodoListJoin {
        key IDTodoList as ID,
            Titolo     as title,
            IDCommessa as orderId,
            Commessa   as order,
            IDCliente  as customerId,
            Cliente    as customer,
            reports : Association to many Reports on reports.ticket = $self
    }

entity Reports : cuid, managed {
    description : String;
    elapsedTime : Time;
    ticket      : Association to Tickets;
}

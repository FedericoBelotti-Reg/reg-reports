using {
    cuid,
    managed
} from '@sap/cds/common';

using {API_TICKETS as api} from '../srv/external/API_TICKETS';

namespace regesta.cap.reports;

@readonly
entity Tickets     as
    projection on api.vwTodoListJoin {
        key IDTodoList as ID,
            Titolo     as Title,
            IDCommessa as OrderId,
            Commessa   as Order,
            IDCliente  as CustomerId,
            Cliente    as Customer,
            Reports          : Association to many Reports on Reports.Ticket = $self
    }

entity Reports : cuid, managed {
    Description : String;
    ElapsedTime : Time;
    Ticket      : Association to Tickets;
    Children : Association to many Children on Children.Report = $self
}

entity Children : cuid {
    Name: String;
    Report : Association to Reports
}

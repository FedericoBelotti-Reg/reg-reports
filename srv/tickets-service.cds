using {regesta.cap.reports as model} from '../db/data-model';

service TicketsService {
    entity Tickets     as projection on model.Tickets;
    entity Reports     as projection on model.Reports;
    entity Children    as projection on model.Children;
}

const cds = require("@sap/cds");

class TicketsService extends cds.ApplicationService {
    async init() {
        console.log(">> Inizializing TicketsService...");

        const { Tickets, Reports } = this.entities;

        console.log(">> Connecting to API_TICKETS...");
        const api = await cds.connect.to("API_TICKETS");

        // /Tickets?$expand=reports.
        this.on("READ", Tickets, async (req, next) => {
            const select = req.query.SELECT;

            // If no column has been requested, serve data through the next handler.
            if (!select.columns) {
                return next();
            }

            // Finding expand column for Reports entity.
            const reportsExpand = req.query.SELECT.columns.find(({ expand, ref }) => expand && ref.find(r => r === "reports"));

            // Removing eventual expand columns.
            req.query.SELECT.columns = req.query.SELECT.columns.filter(({ expand }) => !expand);

            // Retrieving requested entity data.
            const tickets = await api.run(req.query);
            const ticketIds = Array.isArray(tickets) ? tickets.map(ticket => ticket.ID) : [tickets.ID];

            // If the expand for Reports has been found.
            if (reportsExpand) {
                // Adding ID field for expand entity if not already requested.
                if (reportsExpand.expand.indexOf("*") == -1 && !reportsExpand.expand.find(column => column.ref && column.ref.find(ref => ref === "ticket_ID"))) {
                    reportsExpand.expand.push({ ref: ["ticket_ID"] });
                }

                // Get reports for the given ticket_IDs.
                const reports = await cds.run(SELECT.from(Reports).columns(reportsExpand.expand).where({ ticket_ID: { in: ticketIds } }));

                // If any report has been found, push the expanded data to the main entity result set.
                return tickets.map((ticket) => ({ ...ticket, reports: reports.filter(report => report.ticket_ID == ticket.ID) }))
            }

            // If no expand has been requested, serve data through the next handler.
            return next();
        });

        // /Tickets
        this.on("READ", Tickets, async (req) => {
            return await api.run(req.query);
        });

        // !!! Without calling the super.init() method, generic providers will not be enqueued to the handlers chain !!!.
        return await super.init();
    }
}
module.exports = { TicketsService };
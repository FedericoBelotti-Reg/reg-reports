const cds = require("@sap/cds");

class TicketsService extends cds.ApplicationService {
    async init() {
        console.log(">> Inizializing TicketsService...");

        const { Reports } = this.entities;

        // API_TICKETS facade object instance.
        const api = await cds.connect.to("API_TICKETS");

        // READ Tickets.
        this.on("READ", ["Tickets"], async (req, next) => {
            const select = req.query.SELECT;

            if (!select.columns) {
                return next();
            }

            // Finding expand column for Reports entity.
            const reportsExpand = req.query.SELECT.columns.find(({ expand, ref }) => expand && ref[0] === "Reports");

            // Removing eventual expand columns.
            req.query.SELECT.columns = req.query.SELECT.columns.filter(({ expand }) => !expand);

            // Retrieving requested entity data.
            const tickets = await api.run(req.query);
            const ticketIds = Array.isArray(tickets) ? tickets.map(ticket => ticket.ID) : [tickets.ID];

            // If the expand for Reports has been found.
            if (reportsExpand) {
                // Adding ID field for expand entity if not already requested.
                if (reportsExpand.expand.indexOf("*") == -1 && !reportsExpand.expand.find(column => column.ref && column.ref.find(ref => ref === "Ticket_ID"))) {
                    reportsExpand.expand.push({ ref: ["Ticket_ID"] });
                }
                const reports = await cds.run(SELECT.from(Reports).columns(reportsExpand).where({ Ticket_ID: { in: ticketIds } }));

                // If any report has been found, push the expanded data to the main entity result set.
                return tickets.map((ticket) => ({ ...ticket, Reports: [...reports.filter(report => report.Ticket_ID == ticket.ID)] }))
            }

            return next();
        });

        this.on("READ", ["Tickets"], async (req) => {
            return await api.run(req.query);
        })

        this.on("READ", ["Reports"], async (req) => {
            return await cds.run(req.query);
        });
    }
}
module.exports = { TicketsService };
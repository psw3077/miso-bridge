import CardAdminTools from './CardAdminTools';

/**
 * Small isolated mount component for AdminDashboard.
 * Keeping this separate makes the final dashboard integration a two-line change:
 * import CardAdminToolsMount from './CardAdminToolsMount';
 * <CardAdminToolsMount />
 */
export default function CardAdminToolsMount(){return <CardAdminTools/>;}

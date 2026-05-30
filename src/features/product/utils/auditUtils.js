const complete = {
	text: "실사완료",
	color: "#52c41a",
	bg: "#f6ffed",
	needsAudit: false,
	needsInspection: false
};

const plan = {
	text: "점검예정",
	color: "#1890ff",
	bg: "#e6f7ff",
	needsAudit: false,
	needsInspection: true
};

const need = {
	text: "실사필요",
	color: "#fa8c16",
	bg: "#fff7e6",
	needsAudit: true,
	needsInspection: true
};

export const getAuditStatus = (lastAuditDate) => {
	if (!lastAuditDate) return need;

	const diffTime = Math.abs(new Date() - lastAuditDate);
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays <= 7) return complete;
	if (diffDays <= 30) return plan;
	return need;
};
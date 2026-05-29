export const getAuditStatus = (lastAuditDate) => {
	if (!lastAuditDate) return { text: "실사필요", color: "#fa8c16", bg: "#fff7e6", needsAudit: true, needsInspection: true };

	const diffTime = Math.abs(new Date() - lastAuditDate);
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays <= 7) return { text: "실사완료", color: "#52c41a", bg: "#f6ffed", needsAudit: false, needsInspection: false };
	if (diffDays <= 30) return { text: "점검예정", color: "#1890ff", bg: "#e6f7ff", needsAudit: false, needsInspection: true };
	return { text: "실사필요", color: "#fa8c16", bg: "#fff7e6", needsAudit: true, needsInspection: true };
};
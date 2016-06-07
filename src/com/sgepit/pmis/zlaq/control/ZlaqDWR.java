package com.sgepit.pmis.zlaq.control;

import java.util.List;


public class ZlaqDWR {

//	private ProjectCommonService projectCommon;
	
	public ZlaqDWR() {
		// TODO Auto-generated constructor stub
//		projectCommon= (ProjectCommonService) Constant.wact.getBean("ProjectCommonService");		
	}
	
/*	public String getYear(String unitid){
		return projectCommon.getYear(unitid);
	}*/
/*	public String getFundsTree(){
		return projectCommon.getFundsTree();
	}
	public String getProjType(){
		return projectCommon.getProjType();
	}
	public String getUnitList(String where){
		return projectCommon.getUnitList(where);
	}
	public String getProperty(String typename){
		return projectCommon.getProperty(typename);
	}*/
/*	public void saveProjPlan(String projPlanLists){
		System.out.println("saveProjPlan");
		System.out.println(projPlanLists);
		String sql = "";
		System.out.println("saveProjPlan");
	}
	public String getProjStageInStr(String funCode){
		String projStageInStr = "";
		projStageInStr = projectCommon.getProjStageInStr(funCode,"projectStage");
		return projStageInStr;
	}
	public List<ZhjhProjInfo> getProjInfoList(String where, String orderby){
		List rtn = projectCommon.queryProjInfo(where,orderby,null,null);
		return rtn;
	}
	public String getProjNameByLsh(String lsh){
		String rtn = "";
		ZhjhProjInfo zhjhProjInfo = (ZhjhProjInfo)projectCommon.getZhjhProjInfoDAO().findById(lsh);
		if(zhjhProjInfo!=null && zhjhProjInfo.getProjectName()!=null){
			rtn = zhjhProjInfo.getProjectName();
		}
		return rtn;
	}
	public String getVoltageLevelByProjType(String projectType){
		String rtn = "";
		List<ZhjhProjVoltage> t = ZhjhProjVoltageDAO.getInstance().findByProperty("projectType", projectType);
		ZhjhProjVoltage zhjhProjVoltage = null;
		if(t.size()>0)
			zhjhProjVoltage = (ZhjhProjVoltage)t.get(0);
		if(zhjhProjVoltage!=null && zhjhProjVoltage.getVoltageLevel()!=null){
			rtn = zhjhProjVoltage.getVoltageLevel();
		}
		return rtn;
	}
	//����Ŀ��������Ŀ��������������޸ĺ��Լ�ǰ���������жԷ���������޸ĺ���Ŀ��ϢӦ�ò���ֱ��ɾ�����̺���̡�
	public Boolean checkBeforeDeletProjInfo(String lsh){
		return projectCommon.checkBeforeDeletProjInfo(lsh);
	}
	//����Ŀ��������Ŀ��������������޸ĺ��Լ�ǰ���������жԷ���������޸ĺ���Ŀ��ϢӦ�ò���ֱ��ɾ�����̺���̡�
	public String getProjTypeName(String ProjectType){
		String rtn = "";
		ZhjhProjTree zhjhProjTree = (ZhjhProjTree) ZhjhProTreeDAO.getInstence().findById(ProjectType);
		if(zhjhProjTree!=null && zhjhProjTree.getTreename()!=null)
			rtn = zhjhProjTree.getTreename();
		return rtn;
	}
	//��ȡ�ʽ�4Դ���
	public String getFundsTreeName(String treeid){
		String rtn = "";
		ZhjhFundsTree zhjhFundsTree = (ZhjhFundsTree) ZhjhFundsTreeDAO.getInstance().findById(treeid);
		if(zhjhFundsTree!=null && zhjhFundsTree.getTreename()!=null)
			rtn = zhjhFundsTree.getTreename();
		return rtn;
	}
	public Boolean uploadProjInfo(String projLsh){
		return projectCommon.uploadProjInfo(projLsh);
	}
	public Boolean setProjState(String projLsh,String State){
		return projectCommon.setProjState(projLsh,State);
	}
	public Boolean saveProjStateAndDocCode(String projLsh,String state,String docCode) {
		return projectCommon.saveProjStateAndDocCode(projLsh,state,docCode);
	}
	public Boolean saveProjInfoFromStr(String projLsh, String projInfoStr) {
		return projectCommon.saveProjInfoFromStr(projLsh, projInfoStr);
	}
	public String getProjInfoByIdToJson(String projLsh) {
		return projectCommon.getProjInfoByIdToJson(projLsh);
	}
	public String checkAndAutoChangeProjState(String projLsh){
		return projectCommon.checkAndAutoChangeProjState(projLsh);
	}*/
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}

}

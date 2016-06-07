package com.sgepit.frame.flow.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.flow.dao.FlowDAO;
import com.sgepit.frame.flow.hbm.FlwDefinition;
import com.sgepit.frame.flow.hbm.FlwFrame;
import com.sgepit.frame.flow.hbm.GczlFlow;
import com.sgepit.frame.flow.hbm.GczlJymb;
import com.sgepit.frame.flow.hbm.GczlJyxm;

public class FlwZlypMgmImpl extends BaseMgmImpl implements FlwZlypMgmFacade {
	private FlowDAO flowDAO;
	private String defBean;
	private String frameBean;
    
    public FlwZlypMgmImpl(){
        defBean = "com.sgepit.frame.flow.hbm.".concat("FlwDefinition");
        frameBean = "com.sgepit.frame.flow.hbm.".concat("FlwFrame");
    }

	public void setFlowDAO(FlowDAO flowDAO) {
		this.flowDAO = flowDAO;
	}
	/**
	 * 根据建议项目分类编号查询出该分类下对应的流程
	 * @author zhangh 2011-02-21
	 * @param xmbh：检验项目分类的编号
	 * @return List<GczlFlow>
	 */
	public List getFlwListByXmbh(String xmbh) {
		String beanName = "com.sgepit.frame.flow.hbm.GczlJyxm";
		String beanNameFlow = "com.sgepit.frame.flow.hbm.GczlFlow";
		GczlJyxm gczlJyxm = new GczlJyxm();
		try {
			List<GczlJyxm> listJyxm = this.flowDAO.findByProperty(beanName, "xmbh", xmbh);
			if(listJyxm.size()>0){
				 gczlJyxm = listJyxm.get(0);
			}
			List<GczlFlow> list = this.flowDAO.findByProperty(beanNameFlow, "jyxmUids", gczlJyxm.getUids());
			return list;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	/**
	 * 根据建议项目分类编号查询出该分类下对应的模板
	 * @author zhangh 2011-02-21
	 * @param xmbh：检验项目分类的编号
	 * @return List<GczlJymb>
	 */
	public List getModelListByXmbh(String xmbh) {
		String beanName = "com.sgepit.frame.flow.hbm.GczlJyxm";
		String beanNameWord = "com.sgepit.frame.flow.hbm.GczlJymb";
		GczlJyxm gczlJyxm = new GczlJyxm();
		try {
			List<GczlJyxm> listJyxm = this.flowDAO.findByProperty(beanName, "xmbh", xmbh);
			if(listJyxm.size()>0){
				 gczlJyxm = listJyxm.get(0);
			}
			List<GczlJymb> list = this.flowDAO.findByProperty(beanNameWord, "jyxmUids", gczlJyxm.getUids());
			return list;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	/**
	 * 验评流程的获取，返回格式是JSONString
	 */
	public String getZlypFlwTree(String pid) {
		String jsonStr = "[{@node,expanded:true}]";
		try{
			String sql = "select * from (select '0' as id,'质量验评流程' as text, 'root' as type,(select count(frameid) from flw_frame ff where ff.isyp = '1' and ff.unitid = '"+pid+"') as leaf," +
					     " 'root' as pid from dual union " +
						 " select ff.frameid as id, ff.framename as text, 'document' as type," +
						 " (select count(fd.flowid) from flw_definition fd where fd.FRAMEID=ff.frameid and fd.state<>'1' and " +
						 " fd.isyp='1' and fd.unitid = '"+pid+"') as leaf,'0' as pid from flw_frame ff where ff.isyp = '1' and ff.unitid = '"+pid+"' union select flowid as id, " +
						 " FLOWTITLE as text, 'flow' as type, 0 as leaf,frameid as pid from flw_definition where isyp = '1' and " +
						 " unitid = '"+pid+"' and state = '0' and FRAMEID is not null) connect by prior id=pid start with pid='root'";
			List list = flowDAO.getDataAutoCloseSes(sql);
			System.out.println("-->"+sql);
			for(Iterator it=list.iterator();it.hasNext();) {
				Object[] obj = (Object[]) it.next(); 
				
				String id = (String) obj[0];
				String text = (String) obj[1];
				String type = (String) obj[2];
				int l = ((java.math.BigDecimal) obj[3]).intValue();
				String iconCls = type.equals("flow")?"flow":"";
				
				String nodeStr = "id:'"+id+"',text:'"+text+"',iconCls:'"+iconCls+"',";
				if(l>0) {
					nodeStr += "leaf:false,children:[";
					for(int i=1;i<l;i++) {
						nodeStr += "{@node},";
					}
					nodeStr += "{@node}]";
				}else {
					nodeStr += "leaf:true";
				}
				jsonStr = jsonStr.replaceFirst("@node",nodeStr);
			}
			System.out.print(jsonStr);
		}catch(Exception ex){
			ex.printStackTrace();
			return "[]";
		}
		return jsonStr;
	}
	/**
	 * 验评分类树的获取，返回格式是JSONString
	 * 
	 * 树的同步获取方法，验评分类很多，容易造成内存溢出
	 * 
	 * 此接口弃用
	 */
	public String getZlypItemTree() {
		return null;
	}
	/**
	 * 根据模板ID判断该模板是否使用，返回类型 Boolean
	 */
	public boolean isHaveFlwInsByModelid(String fileid) {
		try {
			if(flowDAO.findByWhere("com.sgepit.frame.flow.hbm.FlwInstanceView", "fileid='"+fileid+"'").size()>0){
				return true;
			}else{
				return false; 
			}
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	/**
	 * 判断具体验评分类下是否有运转中的流程，返回类型 Boolean
	 * 
	 * 流程接口
	 */
	public boolean isHaveFlwingByXmbh(String xmbh) {
		try {
			if(flowDAO.findByWhere("com.sgepit.frame.flow.hbm.FlwInstanceView", "xmbh='"+xmbh+"' and status<>'2'").size()>0){
				return true;
			}else{
				return false; 
			}
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	/**
	 * 设置或取消流程的验评属性
	 * @param flowid
	 * @param isyp
	 * @return
	 */
	public boolean setIsypByFlowid(String flowid, String isyp) {
		try{
			FlwDefinition flwdef = (FlwDefinition) flowDAO.findById(defBean, flowid);
			if(flwdef!=null){
				isyp = isyp.equals("1")||isyp.equalsIgnoreCase("true")?"1":"0";
				flwdef.setIsyp(isyp);
				
				if(isyp.equals("1")){//验评流程
					if(flwdef.getFrameid()!=null&&!(flwdef.getFlowid().equals(""))){
						FlwFrame flwFrame = (FlwFrame) flowDAO.findById(frameBean, flwdef.getFrameid());
						if(flwFrame!=null){
							flwFrame.setIsyp(isyp);
							flowDAO.saveOrUpdate(flwFrame);
						}
					}
				}else{//非验评流程
					if(flwdef.getFrameid()!=null&&!(flwdef.getFlowid().equals(""))){
						FlwFrame flwFrame = (FlwFrame) flowDAO.findById(frameBean, flwdef.getFrameid());
						if(flwFrame!=null){
							List list = flowDAO.findByWhere(defBean, "frameid='"+flwdef.getFrameid()+"' " +
									"and isyp='1' and flowid<>'"+flowid+"'");
							if(list.size()==0){
								flwFrame.setIsyp(isyp);
								flowDAO.saveOrUpdate(flwFrame);
							}
						}
					}
				}
				flowDAO.saveOrUpdate(flwdef);
			}
			return true;
		}catch(Exception ex){
			ex.printStackTrace();
			return false;
		}
	}
	/**
	 * 由验评分类id获取子分类
	 * @param id
	 * @return
	 */
	public List<TreeNode> getZlypNodeById(String id) {
		List<TreeNode> list = new ArrayList<TreeNode>();
		
		String parent = id != null && !id.equals("") ? id : "root";
		StringBuffer bfs = new StringBuffer();
		bfs.append("parentbh='" + parent+"'");
		bfs.append(" order by xmbh ");
		List modules = this.flowDAO.findByWhere2("com.sgepit.frame.flow.hbm.GczlJyxm", bfs.toString());
		Iterator<GczlJyxm> itr = modules.iterator();
		while (itr.hasNext()) {
			TreeNode tn = new TreeNode();
			GczlJyxm temp = (GczlJyxm) itr.next();
			int leaf = Integer.parseInt(temp.getIsleaf());
			tn.setId(temp.getUids());
			tn.setText(temp.getXmmc());
			if (leaf == 1) {
				tn.setLeaf(true);
				tn.setIconCls("icon-cmp");
			} else {
				tn.setLeaf(false); // treenode.leaf
				tn.setCls("icon-pkg"); // treenode.cls
			}
			tn.setDescription(temp.getXmmc());
			list.add(tn);
		}
		return list;
	}
}

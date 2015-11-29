package com.sgepit.frame.guideline.control;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.sgepit.frame.base.servlet.MainServlet;
import com.sgepit.frame.guideline.hbm.SgccGuidelineInfo;
import com.sgepit.frame.guideline.service.GuidelineService;
import com.sgepit.frame.sysman.hbm.PropertyCode;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.sysman.service.SystemMgmFacade;


/**
 * 指标
 * @author Shirley
 * @createDate Mar 23, 2009
 **/
public class GuidelineServlet extends MainServlet {

	GuidelineService guidelineService;
	SystemMgmFacade systemMgm;
	
	public GuidelineServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String method = request.getParameter("ac");
		System.out.println("*******************8"+method);
		if (method != null) {
			if (method.equals("tree")) {
				buildTree(request, response);
				return;
			}else if(method.equals("unitTreeIncludeType")){
				buildUnitTree(request, response);
				return;
			}
		}

	}
	
	/**
	  * 建树
	  * @param request
	  * @param response
	  * @throws IOException
	  **/
	private void buildTree(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		
		this.guidelineService = (GuidelineService) wac.getBean("guidelineService");
		
		String parentId = request.getParameter("parentId");
		String treeName = request.getParameter("treeName");
		String guideType = request.getParameter("guideType");
		String state = request.getParameter("state");
		String unitId = request.getParameter("unitId");
		String filterNode = request.getParameter("filterNode");
		System.out.println(filterNode);
		//已选中的指标
		String selectedZb = request.getParameter("selectedZb");
		Map param = new HashMap();
		param.put("state", state);
		param.put("filterNode", filterNode);
		
		String tree = "";
		
		if(treeName.equals("GuidelineTree"))
			tree = (treeName != null) ? convertString(this.guidelineService.buildTreeNodes(treeName,parentId,param),request.getParameter("hasCheckBox"),request.getParameter("treeType"), selectedZb) : "";
		else if(treeName.equals("GuidelineXDTree"))
			tree = (treeName != null) ? this.guidelineService.ConvertGuidelineXDJSon(parentId,guideType) : "";
		else
			tree = (treeName != null) ? this.guidelineService.getDownHistoryTree(unitId) : "";
		outputStr(response, tree);
	}
	
	/**
	  * 指标树拼串
	  * @param list
	  * @return
	  **/
	public String convertString(List list,String hasCheckBox,String treeType, String selectedZb){
		String selectedZbStr = "";
		if (selectedZb!=null && selectedZb.length()>0) {
			selectedZbStr = "`" + selectedZb + "`";
		}
		
		SgccGuidelineInfo info = null;
		String nodeStr="[";
		for(int j=0;j<list.size();j++){
			int count = list.size();
			info = (SgccGuidelineInfo)list.get(j);
			String id = info.getZbSeqno();
			String name = info.getRealname();
			String ifpercent = (info.getIfpercent()==null?"":info.getIfpercent().trim());
			String jldw = (info.getJldw()==null?"":info.getJldw().trim());
			String ifpub = (info.getIfpub()==null?"":info.getIfpub());
			String state = (info.getState()==null?"":info.getState());
			String unitId = (info.getUnitId()==null?"":info.getUnitId());
			nodeStr += "{id:'" + id+"'"
							+ ",text:'" + name + "'"
							+ ",jldw:'" + jldw + "'"
							+ ",ifpub:'" + ifpub + "'"
							+ ",state:'" + state + "'"
							+ ",unitId:'" + unitId + "'"
							+ ",ifpercent:'" + ifpercent + "'"
							+ ",description:'"+id+name+"'";
		   
			int leaf = guidelineService.getCountByParentId(id);
			if(leaf>0){
				nodeStr += ",leaf:false";
			}else{
				nodeStr += ",leaf:true";
			}
			if(hasCheckBox==null||hasCheckBox.equals("true")){
				String check = "false";
				if (selectedZbStr.indexOf("`"+id+"`")>-1) {
					check = "true";
				}
				nodeStr += ",checked:"+check;
			}
			if(treeType!=null&&treeType.equals("columnTree")){
				nodeStr += ",uiProvider:'col'";
			}
			nodeStr += "}";
			if(j==count-1) {
				nodeStr += "]";
			} else{
				nodeStr += ",";
			}
		}
		System.out.println(""+nodeStr);
		return nodeStr;
	}
	
	/**
	  * 建组织机构树
	  * @param request
	  * @param response
	  * @throws IOException
	  **/
	private void buildUnitTree(HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		
		this.systemMgm = (SystemMgmFacade) this.wac.getBean("systemMgm");
		
		String parentId = request.getParameter("parentId");
		String attachUnit = request.getParameter("attachUnit")==null?"":request.getParameter("attachUnit");
		String year = request.getParameter("year")==null?
				new SimpleDateFormat("yyyy").format(Calendar.getInstance().getTime()):request.getParameter("year");
		List<SgccIniUnit> list = this.systemMgm.buildTreeNodes(parentId,attachUnit,year);
		
		String codeStr = "";
		if(request.getParameter("root")!=null&&request.getParameter("root").equals("true")){
			List codeList = systemMgm.getCodeValue("指标单位类型");
			codeStr = convertCodeJson(codeList);
		}
		String tree = this.convertUnitJson(codeStr,list);
		outputStr(response, tree);
	}
	
	private String convertCodeJson(List list){
		String nodeStr="";
		PropertyCode propertyCode = null;
		for(int j=0;j<list.size();j++){
			propertyCode = (PropertyCode)list.get(j);
			String id = propertyCode.getPropertyCode();
			String name = propertyCode.getPropertyName();
			String unitTypeId = "1";
			String attachUnitId = "";
			nodeStr += "{id:'" + id+"'"
						+ ",text:'" + name + "'"
						+ ",unitTypeId:'" + unitTypeId + "'"
						+ ",attachUnitId:'" + attachUnitId + "'"
						+ ",description:'"+id+name+"',leaf:true},";
		} 
		return nodeStr;
	}
	
	private String convertUnitJson(String codeStr,List<SgccIniUnit> list) {
		SgccIniUnit unit = null;
		String nodeStr="[";
		nodeStr+=codeStr;
		for(int j=0;j<list.size();j++){
			int count = list.size();
			unit = (SgccIniUnit)list.get(j);
			String id = unit.getUnitid();
			String name = unit.getUnitname();
			String unitTypeId = unit.getUnitTypeId();
			String attachUnitId = unit.getAttachUnitid();
			nodeStr += "{id:'" + id+"'"
							+ ",text:'" + name + "'"
							+ ",unitTypeId:'" + unitTypeId + "'"
							+ ",attachUnitId:'" + attachUnitId + "'"
							+ ",description:'"+id+name+"'";
		   
			int leaf = this.systemMgm.getUnitCountByParentId(id);
			if(leaf>0){
				nodeStr += ",leaf:false";
			}else{
				nodeStr += ",leaf:true";
			}
			//String check = "false";
			//nodeStr += ",checked:"+check+"}";
			nodeStr += "}";
			if(j==count-1) {
				nodeStr += "]";
			} else{
				nodeStr += ",";
			}
		}
		System.out.println(""+nodeStr);
		return nodeStr;
	}

}

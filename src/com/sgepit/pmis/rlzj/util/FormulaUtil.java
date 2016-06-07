package com.sgepit.pmis.rlzj.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.apache.commons.collections.map.ListOrderedMap;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.guideline.dao.SgccGuidelineInfoDAO;
import com.sgepit.frame.guideline.hbm.SgccGuidelineInfo;

public class FormulaUtil {
	
	/**
	 * 解析工资模板公式，生成xgrid的表头显示
	 * 
	 * 根据HR_SALARY_TEMPLATE_ITEM表中模板对应的工资科目或参数、模板公式，生成xgrid的表头信息
	 * 参数在前，工资科目在后显示；
	 * 参数只读
	 * 
	 * @param templateId
	 * @return
	 * @author: Liuay
	 * @createDate: Jun 22, 2011
	 */
	public String updateXgridTitle(String templateId) {
		//获得模板的公式
		String formulaStr = this.getTemplateFormula(templateId);
		
		//获取模板需要显示的列
		List<ColumnConfig> colList = getTemplateItem(templateId);
		
		if (colList!=null && colList.size()>0) {
			Document headerDoc = DocumentHelper.createDocument();
			Element root = headerDoc.addElement("rows").addElement("head");
			Element userNameCol = root.addElement("column");
			userNameCol.addAttribute("width", "120");
			userNameCol.addAttribute("type", "ro");
			userNameCol.addAttribute("id", "0");
			userNameCol.addAttribute("colSource", "1000");
			userNameCol.addText("员工");
			
			int colNum = 1;
			//模板中涉及的工资科目、参数信息
			Map<String, String> colMap = new HashMap<String, String>();
			for (int i = 0; i < colList.size(); i++) {
				ColumnConfig columnConfig = colList.get(i);
				String itemStr = columnConfig.getColConfig();
				String itemName = columnConfig.getColName();
				Element colEl = root.addElement("column");
				colEl.addAttribute("id", String.valueOf(colNum));
				colEl.addAttribute("width", "120");
				colEl.addText(itemName);
				if (itemStr.startsWith("ITEM:")) {
					colEl.addAttribute("type", "ed");
					colEl.addAttribute("align", "right");
					colEl.addAttribute("sort", "int");
					String colSource = "HR_SALARY_DETAIL.VALUE/" + itemStr.substring(5);
					colEl.addAttribute("colSource", colSource);
					colMap.put(itemStr, String.valueOf(colNum));
					colNum ++ ;
				} else if (itemStr.startsWith("PARAM:")) {
					colEl.addAttribute("type", "ro");
					String paramId = itemStr.substring(6);
					colEl.addAttribute("colSource", paramId);
					String selSql = "select data_type, co_options from HR_SALARY_BASIC_INFO where uids='" + paramId + "'";
					List<Map> l = JdbcUtil.query(selSql);
					if (l.size()==1) {
						Map<String, String> map1 = (Map<String, String>)l.get(0); 
						String dataType = map1.get("data_type");
						String coOptions = map1.get("co_options");
						if(dataType!=null && dataType.equals("co") && coOptions!=null && coOptions.length()>0){
							colEl.addAttribute("type", "co");
							String[] optionArr = coOptions.split("[;]");
							for (int j = 0; j < optionArr.length; j++) {
								String[] p = optionArr[j].split("[,]");
								Element option = colEl.addElement("option");
								option.addAttribute("value", p[0]);
								option.addText(p[1]);
							}
						}
					}
					colMap.put(itemStr, String.valueOf(colNum));
					colNum ++ ;
				}
			}
			
			//对在模板公式中使用的科目或者参数，未添加到HR_SALARY_TEMPLATE_ITEM表中的，在表中隐藏处理
			Map<String, String> varMap = getFormulasVariables(formulaStr);
			Iterator<String> varIter = varMap.keySet().iterator();
			while (varIter.hasNext()) {
				String varTemp = varIter.next();
				if (!colMap.containsKey(varTemp)) {
					Element colEl = root.addElement("column");
					colEl.addAttribute("id", String.valueOf(colNum));
					colEl.addAttribute("width", "120");
					colEl.addText(varMap.get(varTemp));
					if (varTemp.startsWith("ITEM:")) {
						colEl.addAttribute("type", "ed");
						colEl.addAttribute("align", "right");
						colEl.addAttribute("sort", "int");
						String colSource = "HR_SALARY_DETAIL.VALUE/" + varTemp.substring(5);
						colEl.addAttribute("colSource", colSource);
						colEl.addAttribute("hidden", "true");
						colMap.put(varTemp, String.valueOf(colNum));
						colNum ++ ;
					} else if (varTemp.startsWith("PARAM:")) {
						colEl.addAttribute("type", "ro");
						String paramId = varTemp.substring(6);
						colEl.addAttribute("colSource", paramId);
						colEl.addAttribute("hidden", "true");
						colMap.put(varTemp, String.valueOf(colNum));
						colNum ++ ;
					}
				}
			}
			
			//设置表列之间的计算公式
			if (formulaStr!=null && formulaStr.trim().length()>0) {
				String[] formulaArr = formulaStr.split(";");
				for (int i = 0; i < formulaArr.length; i++) {
					String[] expArr = formulaArr[i].split("=");
					String leftExp = expArr[0].trim();
					String rightExp = expArr[1].trim();
					
					String colSource = "HR_SALARY_DETAIL.VALUE/" + leftExp.substring(5);
					Element leftCol = (Element) headerDoc.getRootElement().selectSingleNode("/rows/head/column[@colSource='" + colSource + "']");
					
					//将公式转换为Xgrid表头的计算公式
					Iterator<String> colIter = colMap.keySet().iterator();
					while (colIter.hasNext()) {
						String colExp = colIter.next();
						rightExp = rightExp.replaceAll(colExp, "c" + colMap.get(colExp));
					}
					leftCol.addAttribute("type", "ed[=" + rightExp + "]");
				}
			}
			
			String returnStr = headerDoc.getRootElement().asXML();
			
			String updateSql = "update HR_SALARY_TEMPLATE set xgrid_title = '" + returnStr + "' where uids='" + templateId + "'";
			JdbcUtil.update(updateSql);
			
			XgridBean xgridBean = new XgridBean();
			xgridBean.headerXMLStringToExcel(templateId, returnStr);
			return returnStr;
		}
		return "";
	}
	
	/**
	 * 获取模板选择的科目信息
	 * @param templateId
	 * @return
	 * @author: Liuay
	 * @createDate: Jun 22, 2011
	 */
	public List<ColumnConfig> getTemplateItem(String templateId) {
		//参数信息在前、工资科目信息在后
		String sql = "SELECT type||':'||item_id as col FROM " +
				" (select * from hr_salary_template_item where type='PARAM' AND TEMPLATE_ID='" + templateId + "' ORDER BY ORDER_NUM, item_id)" +
				" UNION ALL" +
				" SELECT type||':'||item_id as col FROM (select * from hr_salary_template_item where type='ITEM' AND TEMPLATE_ID='" + templateId + "' ORDER BY ORDER_NUM, item_id)";
		
		List<ColumnConfig> returnList = new ArrayList<ColumnConfig>();
		List<ListOrderedMap> list = JdbcUtil.query(sql);
		for (int i = 0; i < list.size(); i++) {
			ListOrderedMap map = list.get(i) ;
			String varTemp = (String) map.get("col");
    		String varText = "";
    		if (varTemp.startsWith("ITEM:")) {
				SgccGuidelineInfoDAO infoDAO = SgccGuidelineInfoDAO.getInstence();
				String itemId = varTemp.substring(5);
				SgccGuidelineInfo guidelineInfo = (SgccGuidelineInfo) infoDAO.findById(itemId);
				if (guidelineInfo!=null) {
					varText = guidelineInfo.getRealname();
				}
			} else if (varTemp.startsWith("PARAM:")) {
				String paramId = varTemp.substring(6);
				String selSql = "select name from HR_SALARY_BASIC_INFO where uids='" + paramId + "'";
				List<Map> l = JdbcUtil.query(selSql);
				if (l.size()==1) {
					varText = ((Map<String, String>)l.get(0)).get("name");
				}
			}
    		
    		ColumnConfig columnConfig = new ColumnConfig(varTemp, varText);
    		returnList.add(columnConfig);
		}
		return returnList;
	}
	/**
	 * 根据套帐主键获取公式并转换
	 * @param uids
	 * 
	 * 
	 */
	public String getAccFormula(String uids){
		String formula = "";
		String sql ="select formula from hr_account_set where uids= '"+uids+"'";
		List<ListOrderedMap> list = JdbcUtil.query(sql);
		if(list.size()>0){
			ListOrderedMap map = list.get(0) ;
			formula = map.getValue(0)==null?"":map.getValue(0).toString() ;
			if(!formula.equals("")){
				formula= getFormulaText(formula);
			}
		}
		return formula;
	}
	
	/**
	 * 获取模板的公式
	 * @param templateId
	 * @return
	 * @author: Liuay
	 * @createDate: Jun 22, 2011
	 */
	public String getTemplateFormula(String templateId) {
		String returnStr = null ;
		String sql = "select formula from hr_salary_template where uids = '" + templateId + "'" ;
		List<ListOrderedMap> list = JdbcUtil.query(sql);
		if(list.size()>0) {
			ListOrderedMap map = list.get(0) ;
			returnStr = map.getValue(0)==null?"":map.getValue(0).toString() ;
		}
		return returnStr.trim();
	}
	
	/**
	 * 将公式转换成文字显示
	 * @param formulaStr
	 * @return
	 * @author: Liuay
	 * @createDate: Jun 23, 2011
	 */
	public String getFormulaText(String formulastr) {
		Map<String, String> map = getFormulasVariables(formulastr);
		Iterator<String> varIter = map.keySet().iterator();
		while (varIter.hasNext()) {
			String varTemp = varIter.next();
			formulastr = formulastr.replaceAll("" + varTemp + "", map.get(varTemp));
		}
		return formulastr;
	}
	
	/**
	 * 将公式转成公式编码 [同时进行公式校验]
	 * @param formulaTextStr
	 * @return
	 * @author: Liuay
	 * @createDate: Jun 23, 2011
	 */
	public String getFormulaByText(String formulaTextStr) {
		String[] formulaTextArr = formulaTextStr.trim().split(";");
		String errMsg = "";
		
		Map<String, String> varMap = new HashMap<String, String>();
		
		for (int i = 0; i < formulaTextArr.length; i++) {
			String formulaText = formulaTextArr[i].trim();
			if (formulaText!=null && formulaText.length()>0) {
				String[] formulaParts = formulaText.split("=");
				if (formulaParts.length==2) {
					String leftExp = formulaParts[0].trim();
					String rightExp = formulaParts[1].trim();
					String leftExpCode = getGuidelineInfoByName(leftExp);
					
					//解析等式左边的表达式
					if (leftExpCode!=null && leftExpCode.length()>0) {
						varMap.put(leftExp, "ITEM:" + leftExpCode);
					} else {
						errMsg = "公式【" + formulaText + "】等式左边不是工资科目；";
					}
					
					if (rightExp!=null && rightExp.length()>0) {
						String lastExp = rightExp.substring(rightExp.length()-1, rightExp.length());
						if(lastExp.equals("+")||lastExp.equals("-")||lastExp.equals("*")||lastExp.equals("/")) {
							errMsg = "公式【" + formulaText + "】中等式右边表达式【" + rightExp + "】错误；";
						} else {
							//解析等式右边的表达式
							rightExp = rightExp.replaceAll("[+]", " ");
							rightExp = rightExp.replaceAll("[-]", " ");
							rightExp = rightExp.replaceAll("[/]", " ");
							rightExp = rightExp.replaceAll("[*]", " ");
							rightExp = rightExp.replaceAll("[(]", " ");
							rightExp = rightExp.replaceAll("[)]", " ");
							while (rightExp.indexOf("  ") != -1) {
								rightExp = rightExp.replaceAll("  ", " ");
							}
							String[] variables = rightExp.split(" ");
							for (int j = 0; j < variables.length; j++) {
								try {
									Float.valueOf(variables[j]);
								} catch (Exception e) {
									if (!variables[j].trim().equals("")) {
										String varText = variables[j];
										String varCode = "";
										
										varCode = getGuidelineInfoByName(varText);
										if (varCode!=null && varCode.length()>0) {
											varMap.put(varText, "ITEM:" + varCode);
										} else {
											varCode = getHrSalaryBasicInfoByName(varText);
											if (varCode!=null && varCode.length()>0) {
												varMap.put(varText, "PARAM:" + varCode);
											}else {
												errMsg = "公式【" + formulaText + "】中【" + varText + "】错误；";
											}
										}
									}
								}
							}
						}
					} else {
						errMsg = "公式【" + formulaText + "】不是等式；";
					}
				} else {
					errMsg = "公式【" + formulaText + "】不是等式；";
				}
			}
		}
		
		if (errMsg.length()==0) {
			Iterator<String> varIter = varMap.keySet().iterator();
			while (varIter.hasNext()) {
				String varTemp = varIter.next();
				formulaTextStr = formulaTextStr.replaceAll("\\b"+varTemp+"\\b", varMap.get(varTemp));
				
				//替换公式中的空格和换行符；
				formulaTextStr = formulaTextStr.replaceAll(" ", "");
				formulaTextStr = formulaTextStr.replaceAll("\r", "");
				formulaTextStr = formulaTextStr.replaceAll("\n", "");
			}
			return formulaTextStr;
		} else {
			System.out.println("公式配置错误：： " + errMsg);
			return errMsg;
		}
	}
	
	
	
	/**
	 * 根据参数名称获取参数编码
	 * @param varText
	 * @return
	 * @author: Liuay
	 * @createDate: Jun 24, 2011
	 */
	private String getHrSalaryBasicInfoByName(String varText) {
		String selSql = "select uids from HR_SALARY_BASIC_INFO where name='" + varText + "'";
		List<Map> l = JdbcUtil.query(selSql);
		if (l.size()>0) {
			return ((Map<String, String>)l.get(0)).get("uids");
		}
		return null;
	}

	/**
	 * 根据指标名称获取指标编码
	 * @param leftExp
	 * @return
	 * @author: Liuay
	 * @createDate: Jun 24, 2011
	 */
	private String getGuidelineInfoByName(String leftExp) {
		String sql = " select zb_seqno from sgcc_guideline_info where (name='" + leftExp + "' or realname='" + leftExp + "') and parentid = '005' ";
		List l = JdbcUtil.query(sql);
		if (l.size()>0) {
			return ((Map<String, String>)l.get(0)).get("zb_seqno");
		}
		return null;
	}

	/**
	 * 根据公式得到公式中的变量
	 * @param formulastr
	 * @return
	 */
	public static Map<String,String> getFormulasVariables(String formulastr) {
        Map<String, String> map = new TreeMap<String,String>();
        if (formulastr != null) {
	    	formulastr = formulastr.replaceAll("[+]", " ");
	    	formulastr = formulastr.replaceAll("[-]", " ");
	    	formulastr = formulastr.replaceAll("[/]", " ");
	    	formulastr = formulastr.replaceAll("[*]", " ");
	    	formulastr = formulastr.replaceAll("[(]", " ");
	    	formulastr = formulastr.replaceAll("[)]", " ");
	    	formulastr = formulastr.replaceAll("[=]", " ");
	    	formulastr = formulastr.replaceAll("[;]", " ");
            while (formulastr.indexOf("  ") != -1) {
            	formulastr = formulastr.replaceAll("  ", " ");
            }
            String[] variables = formulastr.split(" ");
            for (int j = 0; j < variables.length; j++) {
                try {
                    Float.valueOf(variables[j]);
                } catch (Exception e) {
                	if (!variables[j].trim().equals("")) {
                		String varTemp = variables[j];
                		String varText = "";
                		if (varTemp.startsWith("ITEM:")) {
							SgccGuidelineInfoDAO infoDAO = SgccGuidelineInfoDAO.getInstence();
							String itemId = varTemp.substring(5);
							SgccGuidelineInfo guidelineInfo = (SgccGuidelineInfo) infoDAO.findById(itemId);
							if (guidelineInfo!=null) {
								varText = guidelineInfo.getRealname();
							}
						} else if (varTemp.startsWith("PARAM:")) {
							String paramId = varTemp.substring(6);
							String selSql = "select name from HR_SALARY_BASIC_INFO where uids='" + paramId + "'";
							List<Map> l = JdbcUtil.query(selSql);
							if (l.size()==1) {
								varText = ((Map<String, String>)l.get(0)).get("name");
							}
						}
                		map.put(variables[j], varText);
                	}
                }
            }
        }
        return map;
    }
	
	private class ColumnConfig {
		//列基本配置
		private String colConfig;
		
		//列显示名称
		private String colName;

		public String getColConfig() {
			return colConfig;
		}

		public void setColConfig(String colConfig) {
			this.colConfig = colConfig;
		}

		public String getColName() {
			return colName;
		}

		public void setColName(String colName) {
			this.colName = colName;
		}

		public ColumnConfig() {
			super();
		}
		
		public ColumnConfig(String colConfig, String colName) {
			super();
			this.colConfig = colConfig;
			this.colName = colName;
		}
	}

}

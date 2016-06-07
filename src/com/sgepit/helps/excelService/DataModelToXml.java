/** 
 * Title:        数据服务应用: 
 * Description:  数据体模型转换应用
 * Company:      sgepit
 */
package com.sgepit.helps.excelService;

import java.util.List;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.sgepit.helps.dataService.model.DataColBean;
import com.sgepit.helps.dataService.model.DataModel;
import com.sgepit.helps.dataService.model.DataRowBean;
import com.sgepit.helps.dataService.model.HeaderBean;

/**
 * 实现数据体对象到excel生成对象所需的xml的转换
 * @author lizp
 * @Date 2010-8-10
 */
public class DataModelToXml {
	/**
	 * 数据体对象生成满足excel生成对象标准xml字符串
	 * @param data 数据体对象
	 * @return excel生成对象的标准xml字符串
	 */
	public static String dataToXMLString(DataModel data){
		Document document = dataToXML(data);
		return document.asXML() ;
	}
	
	/**
	 * 数据体对象生成满足excel生成对象标准xml对象
	 * @param data 数据体对象
	 * @return excel生成对象的标准xml对象
	 */
	public static Document dataToXML(DataModel data){
		Document document = DocumentHelper.createDocument() ;
		Element workbooks = document.addElement("workbooks");
		Element workbook = workbooks.addElement("workbook");
		Element sheet = workbook.addElement("sheet");
		String tableName = data.getTableName() ;
		if(tableName!=null) {
			sheet.addAttribute("name", tableName) ;
		}
		
		//头处理
		List<HeaderBean> headers = data.getHeader();
		if(headers!=null) {
			Element headRow = sheet.addElement("row");
			String autoSizeColumn = "";
			String widthColumn = "";
			for(HeaderBean bean : headers) {
				String width = bean.getWidth()==null?"":(Integer.parseInt(bean.getWidth())/2.8)+"" ;
				String value = bean.getValue()==null?"":bean.getValue() ;
				if("".equals(width)) {
					autoSizeColumn += ","+bean.getIndex();
				}
				widthColumn += ","+width;
				
				Element cell = headRow.addElement("cell");
				cell.addAttribute("index", bean.getStringIndex()) ;
				cell.addAttribute("type", "string") ;
				cell.addAttribute("fontBold", 700+"") ;//加粗
				cell.addAttribute("alignment", 2+"") ;//居中
				cell.addAttribute("fontSize", "12") ;//字体大一号
				cell.addCDATA(value) ;
			}
			if(!"".equals(autoSizeColumn)) {
				autoSizeColumn = autoSizeColumn.substring(1) ;
				sheet.addAttribute("autoSizeColumn", autoSizeColumn) ;
			}
			if(!"".equals(widthColumn)) {
				widthColumn = widthColumn.substring(1) ;
				sheet.addAttribute("colWidths", widthColumn) ;
			}
		}
		
		//数据主体处理
		List<DataRowBean> datas = data.getDatas();
		if(datas!=null) {
			for(DataRowBean rowBean : datas) {
				if(rowBean!=null) {
					Element row = sheet.addElement("row");
					List<DataColBean> cols = rowBean.getCols();
					if(cols!=null) {
						for(DataColBean col : cols) {
							if(col!=null) {
								Element cell = row.addElement("cell");
								cell.addAttribute("index", col.getIndex()+"") ;
								String type = col.getType() ;
								if(type!=null&&(!"".equals(type))) {
									cell.addAttribute("type",type) ;
								}
								Object value = col.getValue() ;
								if(value!=null) {
									cell.addCDATA(value.toString()) ;
								}
							}
						}
					}
				}
			}
		}
		return document ;
	}
}

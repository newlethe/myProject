/** 
 * Title:        excel应用: 
 * Description:  excel生成应用
 * Company:      sgepit
 */
package com.sgepit.helps.excelService;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFDataFormat;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.sgepit.helps.util.StringUtil;


/**
 * excel生成
 * @author lizp
 * @Date 2010-8-10
 * 由特定xml格式生成excel
 * 此方法目前对样式处理仅限于常用样式
 * xml格式如下
 * <workbooks>
 * 		<workbook name="第一个excel">
 * 				<sheet name="1" colWidths="100,100,-1,0" autoSizeColumn="0,1,2,3,4" colTypes="string,number,date,time" hide="0" colAlign="left,center,right" template="1">
 * 					<row index="0">
 * 						<cell index="1" type="string" fontSize='5'>
 * 						</cell>
 * 					</row>
 * 				</sheet>
 * 		</workbook>
 * </workbooks>
 */
public class XMLToExcel {
	/**
	 * 由标准的xml字符串生成excel
	 * @param xml 标准的xml字符串
	 * @return excel的字节数组输出流对象
	 * @throws IOException
	 * @throws DocumentException
	 */
	public static ByteArrayOutputStream XMLToExcel(String xml) throws IOException, DocumentException {
		Document document = DocumentHelper.parseText(xml) ;
		return XMLToExcel(document);
	}
	/**
	 * 由标准的xml对象生成excel
	 * @param document 标准的xml对象
	 * @return excel的字节数组输出流对象
	 * @throws IOException
	 * @throws DocumentException
	 */
	public static ByteArrayOutputStream XMLToExcel(Document document) throws IOException, DocumentException {
		ByteArrayOutputStream bos = new ByteArrayOutputStream() ;
		HSSFWorkbook wb = XMLToPOI(document) ;
		wb.write(bos) ;
		bos.flush() ;
		bos.close() ;
		return  bos;
	}
	
	/**
	 * 由标准的xml对象生成poi的excel对象
	 * @param document 标准的xml对象
	 * @return poi的excel对象
	 * @throws DocumentException
	 */
	public static HSSFWorkbook XMLToPOI(Document document) throws DocumentException {
		HSSFWorkbook hfwb = new HSSFWorkbook() ;
		List<Element> wblist = document.selectNodes("/workbooks/workbook") ;
		if(wblist.size()>0) {
			Element wb = wblist.get(0) ;
			String wbname = wb.attributeValue("name")==null?StringUtil.getUUID()+".xls":wb.attributeValue("name");
			xmlToWookbook(hfwb,wb);
		}
		return  hfwb;
	}
	
	
	/**
	 * xml对象生成单个poi的HSSFWorkbook对象
	 * @param hfwb poi的HSSFWorkbook对象
	 * @param wb xml对象中的workbook节点对象
	 */
	private static void xmlToWookbook(Workbook hfwb, Element wb) {
		if(hfwb!=null) {
			HashMap<String,CellStyle> stylesMap = new HashMap<String,CellStyle>() ;//样式map，存放各种样式
			getConfigStyle(hfwb,stylesMap,new HashMap<String,String>()) ;
			List<Element> sheetslist = wb.elements("sheet") ;
			ArrayList<String> templateSheetNames = new ArrayList<String>() ;
			for(int i=0;i<hfwb.getNumberOfSheets();i++) {
				templateSheetNames.add(hfwb.getSheetName(i)) ;
			}
			for(int s = 0 ;s < sheetslist.size() ;s++)  {
				Element sheet = sheetslist.get(s) ;
				String sheetTemplate = sheet.attributeValue("template") ;
				String sheetname = sheet.attributeValue("name") ;
				String colWidths = sheet.attributeValue("colWidths") ;
				String colTypes = sheet.attributeValue("colTypes") ;
				String colAlign = sheet.attributeValue("colAlign") ;
				String autoSizeColumn = sheet.attributeValue("autoSizeColumn") ;
				ArrayList<Double> widthList = new ArrayList<Double>() ;
				ArrayList<String> typeList = new ArrayList<String>() ;
				ArrayList<String> alignList = new ArrayList<String>() ;
				ArrayList<Short> autoSizeColumnList = new ArrayList<Short>() ;
				if(colWidths!=null) {   //列宽数组
					for(int i=0;i<colWidths.split("[,]").length;i++)  {
						String w = colWidths.split("[,]")[i] ;
						Double width = null ;
						if(w!=null&&(!"".equals(w))) {
							try {
								width = Double.parseDouble(w) ;
							} catch (NumberFormatException e) {
								e.printStackTrace();
							}
						}
						widthList.add(width) ;
					}
				}
				if(colTypes!=null) {  //列类型数组
					for(int i=0;i<colTypes.split("[,]").length;i++)  {
						String colt = null ;
						String t = colTypes.split("[,]")[i] ;
						if(t!=null&&(!"".equals(t))) {
							colt = t.trim().toLowerCase() ;
						}
						typeList.add(colt) ;
					}
				}
				if(colAlign!=null) {  //水平对齐方式
					for(int i=0;i<colAlign.split("[,]").length;i++)  {
						String colt = null ;
						String t = colAlign.split("[,]")[i] ;
						if(t!=null&&(!"".equals(t))) {
							colt = tranAlign(t.trim())+"" ;
						}
						alignList.add(colt) ;
					}
				}
				if(autoSizeColumn!=null) {  //自动宽度
					for(int i=0;i<autoSizeColumn.split("[,]").length;i++)  {
						Short col = null ;
						String c = autoSizeColumn.split("[,]")[i] ;
						if(c!=null&&(!"".equals(c))) {
							try {
								col = Short.parseShort(c) ;
							} catch (NumberFormatException e) {
								e.printStackTrace();
							}
						}
						autoSizeColumnList.add(col) ;
					}
				}
				
				//创建sheet页
				Sheet hfsheet = null ;
				if(sheetTemplate==null||(!isNum(sheetTemplate))||(Integer.parseInt(sheetTemplate)+1>hfwb.getNumberOfSheets()))  {
					hfsheet = hfwb.createSheet() ;
				} else {   //存在模板时(对应着复制的sheet页序号)
					hfsheet = hfwb.cloneSheet(Integer.parseInt(sheetTemplate)) ;
				}
				List<Element> rowlist = sheet.elements("row") ;
				for(int r = 0 ;r < rowlist.size() ;r++)  {
					Element row = rowlist.get(r)  ;
					String rowindex = row.attributeValue("index") ;
					HashMap<String,String> rmap = new HashMap<String,String>() ;
					Iterator it = row.attributeIterator() ;
					while(it.hasNext()) {
						Attribute attribute = (Attribute) it.next() ;
						String attributeName = attribute.getName() ;
						if(attributeName.equals("index")) {
							continue ;
						} else {
							if(rmap.containsKey(attributeName)) {
								rmap.remove(attributeName) ;
							}
							rmap.put(attributeName,attribute.getText()) ;
						}
					}
					//相关属性
					int rindex = 0 ;
					if(rowindex!=null) {
						rindex = Integer.parseInt(rowindex) ;
					}  else {
						if(hfsheet.getPhysicalNumberOfRows()==0){
							rindex = 0 ;
						} else {
							rindex = hfsheet.getLastRowNum()+1 ;
						}
					}
					Row hfrow = hfsheet.createRow(rindex) ;   //创建行
					List<Element> celllist = row.elements("cell") ;
					int currentIndex = 0 ;
					for(int c=0;c<celllist.size();c++)  {
						Element cell = celllist.get(c)  ;
						String cellIndex = cell.attributeValue("index") ; //列号
						String cellType = cell.attributeValue("type") ; //类型
						String cellValue = cell.getText() ;
						HashMap<String,String> cmap = new HashMap<String,String>() ;
						Iterator<String> kit = rmap.keySet().iterator() ;
						while(kit.hasNext()) {
							String key = kit.next() ;
							cmap.put(key, rmap.get(key)) ;
						}
						
						//列水平对齐方式
						if(c<alignList.size()&&alignList.get(c)!=null) {
							cmap.put("alignment", alignList.get(c)) ;
						}
						
						//相关属性
						Iterator cit = cell.attributeIterator() ;
						while(cit.hasNext()) {
							Attribute attribute = (Attribute)cit.next() ;
							String attributeName = attribute.getName() ;
							if(attributeName.equals("index")||attributeName.equals("type")) {
								continue ;
							} else {
								if(cmap.containsKey(attributeName)) {
									cmap.remove(attributeName) ;
								}
								cmap.put(attributeName,attribute.getText()) ;
							}
						}
						
						int cindex = currentIndex ;
						if(cellIndex!=null)  {
							cindex = Integer.parseInt(cellIndex) ;
						} 
						currentIndex = cindex+1 ;
						Cell hfcell = hfrow.createCell(cindex) ;//创建cell
						//给单元格赋值
						Short dataFormat = setCellValue(hfcell,cellType==null?((typeList.size()<=cindex||typeList.get(cindex)==null)?"string":typeList.get(cindex).toString()):cellType,cellValue) ;
						if(dataFormat!=null) {
							cmap.put("dataFormat", dataFormat+"") ;
						}
						//设置单元格样式
						hfcell.setCellStyle(getConfigStyle(hfwb,stylesMap,cmap)) ;
						
						//处理合并单元格
						String value = hfcell.toString() ;
						if(value.equals("#cspan"))  {   //合并列处理
							hfsheet.addMergedRegion(new CellRangeAddress(rindex, (short)(cindex-1), rindex, (short)cindex)); 
						} else if(value.equals("#rspan")) {  //合并行处理
							hfsheet.addMergedRegion(new CellRangeAddress(rindex-1, (short)cindex, rindex, (short)cindex));
						}
					}
				}
				//设置sheet页名称
				if(sheetname!=null) {
					int sheetIx = hfwb.getSheetIndex(hfsheet) ;
					hfwb.setSheetName(sheetIx, sheetname) ;
				}
				//设置列宽
				for(int i=0;i<widthList.size();i++) {
					Double w = widthList.get(i);
					if(w!=null) {
						double width = widthList.get(i)*258 ;
						if(width>0) {
							hfsheet.setColumnWidth(i, (short)width) ;
						} else if(width==0) {
							hfsheet.setColumnHidden(i, true) ;
						} else {  //poi没有删除列的方法
							hfsheet.setColumnHidden(i, true) ;
						}
					}
				}
				//设置自动扩充
				for(int i=0;i<autoSizeColumnList.size();i++) {
					Short col = autoSizeColumnList.get(i);
					if(col!=null) {
						hfsheet.autoSizeColumn(autoSizeColumnList.get(i));
					}
				}
			}
			//删除模板页
			for(int i=0;i<templateSheetNames.size();i++) {
				hfwb.removeSheetAt(hfwb.getSheetIndex(templateSheetNames.get(i))) ;
			}
		}
	}

	/**
	 * 水平对齐方式转换
	 * @param align 对齐方式的字符串标识
	 * @return poi HSSFCellStyle 中对齐方式的值
	 */
	private static int tranAlign(String align) {
		int retInt = HSSFCellStyle.ALIGN_RIGHT ;
		if(align.equalsIgnoreCase("center")) {
			retInt = HSSFCellStyle.ALIGN_CENTER ;
		} else if(align.equalsIgnoreCase("left")) {
			retInt = HSSFCellStyle.ALIGN_LEFT ;
		} else if(align.equalsIgnoreCase("right")) {
			retInt = HSSFCellStyle.ALIGN_RIGHT ;
		} 
		return retInt;
	}

	/**
	 * 设置初始样式表
	 * @param wb poi的HSSFWorkbook对象
	 * @param stylesMap 样式配置信息集合
	 * @return poi HSSFCellStyle 样式对象
	 */
	public static CellStyle getConfigStyle(Workbook wb, HashMap<String,CellStyle> stylesMap,Map<String,String> ctstyleMap) {
		String fontName = ctstyleMap.containsKey("fontName")?ctstyleMap.get("fontName"):"宋体"  ;
		int fontSize = ctstyleMap.containsKey("fontSize")?Integer.parseInt(ctstyleMap.get("fontSize")):10 ;
		short fontBold = ctstyleMap.containsKey("fontBold")?Short.valueOf(ctstyleMap.get("fontBold")).shortValue():HSSFFont.BOLDWEIGHT_NORMAL ;
		boolean fontItalic = ctstyleMap.containsKey("fontItalic")?Boolean.parseBoolean(ctstyleMap.get("fontItalic")):false ;
		boolean wrapText = ctstyleMap.containsKey("wrapText")?Boolean.parseBoolean(ctstyleMap.get("wrapText")):true ;
		short alignment = ctstyleMap.containsKey("alignment")?Short.valueOf(ctstyleMap.get("alignment")).shortValue():HSSFCellStyle.ALIGN_LEFT ;
		short verticalAlignment = ctstyleMap.containsKey("verticalAlignment")?Short.valueOf(ctstyleMap.get("verticalAlignment")).shortValue():HSSFCellStyle.VERTICAL_CENTER ;
		short bottomBorder = ctstyleMap.containsKey("bottomBorder")?Short.valueOf(ctstyleMap.get("bottomBorder")).shortValue():HSSFCellStyle.BORDER_THIN ;
		short topBorder = ctstyleMap.containsKey("topBorder")?Short.valueOf(ctstyleMap.get("topBorder")).shortValue():HSSFCellStyle.BORDER_THIN ;
		short leftBorder = ctstyleMap.containsKey("leftBorder")?Short.valueOf(ctstyleMap.get("leftBorder")).shortValue():HSSFCellStyle.BORDER_THIN ;
		short rightBorder = ctstyleMap.containsKey("rightBorder")?Short.valueOf(ctstyleMap.get("rightBorder")).shortValue():HSSFCellStyle.BORDER_THIN ;
		Short dataFormat = ctstyleMap.containsKey("dataFormat")?(ctstyleMap.get("dataFormat")==null?null:Short.valueOf(ctstyleMap.get("dataFormat"))):null ;
		String key = fontName+"`"+fontSize+"`"+fontBold+"`"+fontItalic+"`"+wrapText+"`"+alignment+"`"+verticalAlignment+"`"+bottomBorder+"`"+topBorder+"`"+leftBorder+"`"+rightBorder+"`"+dataFormat ;
		CellStyle cellStyle = null ;
		if(stylesMap!=null) {
			if(stylesMap.containsKey(key)) {
				cellStyle = stylesMap.get(key) ;
			} else {
				cellStyle = createCellStyle(wb,fontName,fontSize,fontBold,fontItalic,wrapText,alignment,verticalAlignment,bottomBorder,topBorder,leftBorder,rightBorder,dataFormat) ;
				stylesMap.put(key, cellStyle) ;
			}
		}
		return cellStyle ;
	}

	/**
	 * 根据单元格类型给单元格赋值
	 * 目前仅处理了以下几种类型：boolean，calendar，date，number。其他都以文本型处理
	 * @param hfcell poi的HSSFCell对象
	 * @param cellType 单元格类型
	 * @param cellValue 单元格值
	 */
	private static Short setCellValue(Cell hfcell, String cellType, String cellValue) {
		Short dataFormat = null ; 
		String cell = cellType.trim() ;
		if(cell.equalsIgnoreCase("boolean")) {  //真假值
			boolean value = new Boolean(cellValue).booleanValue() ;
			hfcell.setCellValue(value) ;
		} else if(cell.equalsIgnoreCase("calendar")){
			if(cellValue!=null&&!cellValue.equals("")) {
				Calendar value=new GregorianCalendar();
				Date d=null;
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				try {
					d = sdf.parse(cellValue);
				} catch (ParseException e) {
					e.printStackTrace();
				}  
				value.setTime(d); 
				hfcell.setCellValue(value) ;
				dataFormat = HSSFDataFormat.getBuiltinFormat("m/d/yy h:mm") ;
			}
		} else if(cell.equalsIgnoreCase("date")){
			Date value = null ;
			if(cellValue!=null&&!cellValue.equals("")) {
				DateFormat format = new SimpleDateFormat("yyyy-MM-dd");   
				try {
					value = format.parse(cellValue) ;
				} catch (ParseException e) {
					e.printStackTrace();
				}
			}
			if(value!=null) {
				hfcell.setCellValue(value) ;
				dataFormat = HSSFDataFormat.getBuiltinFormat("m/d/yy") ;
			}
		} else if(cell.equalsIgnoreCase("number")){
			if(cellValue!=null&&!cellValue.equals("")) {
				if(!isNum(cellValue)) {
					HSSFRichTextString value = new HSSFRichTextString(cellValue) ;
					hfcell.setCellValue(value) ;
				} else {
					double value = Double.valueOf(cellValue).doubleValue() ;
					hfcell.setCellValue(value) ;
				}
			}
		} else {
			HSSFRichTextString value = new HSSFRichTextString(cellValue) ;
			hfcell.setCellValue(value) ;
		}
		return dataFormat;
	}
	
	/**
	 * 判断字符串是否可转换成数字
	 * @param p_str 待判断字符串
	 * @return boolean
	 */
	public static boolean isNum(String p_str) {
		if(p_str.matches("^[-]?\\d*[.]?\\d*$") && !p_str.equals("-")) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * 生成poi样式对象
	 * @param wb
	 * @param fontName
	 * @param fontSize
	 * @param fontBold
	 * @param ifItalic
	 * @param ifWrapText
	 * @param alignment
	 * @param verticalAlignment
	 * @param BorderBottom
	 * @param BorderTop
	 * @param BorderLeft
	 * @param BorderRight
	 * @param dataFormat
	 * @return
	 */
	private static CellStyle createCellStyle(Workbook wb,String fontName,int fontSize,short fontBold,boolean ifItalic,
			boolean ifWrapText,short alignment,short verticalAlignment,short BorderBottom,short BorderTop,short BorderLeft,short BorderRight, Short dataFormat){
		Font font = wb.createFont();    
		font.setFontHeightInPoints((short)fontSize);  
		font.setFontName(fontName);  
		font.setBoldweight(fontBold);
		font.setItalic(ifItalic);
		CellStyle styleCell = wb.createCellStyle();
		styleCell.setFont(font);
		styleCell.setAlignment(alignment);
		styleCell.setVerticalAlignment(verticalAlignment);
		styleCell.setWrapText(ifWrapText);
		styleCell.setBorderBottom(BorderBottom);
		styleCell.setBorderTop(BorderTop);
		styleCell.setBorderLeft(BorderLeft);
		styleCell.setBorderRight(BorderRight);
		if(dataFormat!=null) {
			styleCell.setDataFormat(dataFormat) ;
		}
		return styleCell;	
	 }
}

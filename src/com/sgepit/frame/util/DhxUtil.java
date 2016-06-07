package com.sgepit.frame.util;

import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URLEncoder;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.dhtmlx.connector.DataAction;
import com.dhtmlx.connector.DataItem;

/**
 * DHX工具类
 * 
 * @author hanhl
 * @version 1.0
 */
public class DhxUtil {
	/**
	 * dhx的connector中读取到的时间格式
	 */
	private static String formatDateTimeForDhxConnector = "MM/dd/yyyy HH:mm:ss";
	/**
	 * dhx前台组件需要的日期格式
	 */
	private static String formatDateForDhxUi = "yyyy/MM/dd";
	/**
	 * dhx前台组件需要的日期时间格式
	 */
	private static String formatDateTimeForDhxUi = "yyyy/MM/dd HH:mm:ss";
	/**
	 * 更新到oracle中的日期格式
	 */
	private static String formatDateForOracle = "yyyy/mm/dd";
	/**
	 * 更新到oracle中的日期时间格式
	 */
	private static String formatDateTimeForOracle = "yyyy/mm/dd hh24:mi:ss";
	/**
	 * 更新到oracle中的日期时间格式
	 */
	private static int transConnectorMethodDefaultMaxParamsNum = 4;

	public static String LINK_FUNCTION = "_linkCallFun";

	// @Deprecated
	// /**
	// * set_options所需要的状态map，来自于property_code属性表
	// * @param typeName
	// * @return
	// */
	// public static HashMap<String,String> getStateMap(String typeName){
	// SystemMgmFacade sgi = (SystemMgmFacade)
	// SpringContextUtil.getBean("systemMgm");
	// HashMap<String,String> map = new HashMap<String,String>();
	// List<PropertyCode> billStatelist = sgi.getCodeValue(typeName);
	// for(PropertyCode pc:billStatelist){
	// map.put(pc.getPropertyCode(), pc.getPropertyName());
	// }
	// return map;
	// }
	// /**
	// * set_options所需要的map，来自于property_code属性表
	// * @param typeName
	// * @return
	// */
	// public static HashMap<String,String> getPorpertyCodeMap(String typeName){
	// return getStateMap(typeName);
	// }

	/**
	 * set_options所需要的map
	 * 
	 * @param codeCol
	 *            数据库中值的字段名 如：unitid
	 * @param nameCol
	 *            显示值的字段名称 如：unitname
	 * @param table
	 *            数据库表名 如：sgcc_ini_unit
	 * @return
	 */
	public static HashMap<String, String> getOptionsMap(String codeCol,
			String nameCol, String table) {
		return getOptionsMap(codeCol, nameCol, table, "1=1");

	}

	/**
	 * set_options所需要的map
	 * 
	 * @param codeCol
	 *            数据库中值的字段名 如：unitid
	 * @param nameCol
	 *            显示值的字段名称 如：unitname
	 * @param table
	 *            数据库表名 如：sgcc_ini_unit
	 * @param filter
	 *            过滤条件 如：1=1
	 * @return
	 */
	public static HashMap<String, String> getOptionsMap(String codeCol,
			String nameCol, String table, String filter) {
		HashMap<String, String> returnMap = new LinkedHashMap<String, String>();
		String sql = "select " + codeCol + "," + nameCol + " from " + table
				+ " where " + filter;
		List list = JdbcUtil.query(sql);
		for (int i = 0; i < list.size(); i++) {
			Map map = (Map) list.get(i);
			String value = map.get(codeCol.toUpperCase()).toString();
			String lable = map.get(nameCol.toUpperCase()) == null ? "" : map
					.get(nameCol.toUpperCase()).toString();
			returnMap.put(value, lable);
		}
		return returnMap;
	}

	/**
	 * 转换dhtmlx link单元格类型
	 * 
	 * @param linkName
	 *            link单元格中显示内容
	 * @param scriptName
	 *            调用javascript方法名
	 * @param varname
	 *            参数集合
	 * @return
	 */
	public static String renderLinkValue(String linkName, String scriptName,
			String... varname) {
		StringBuffer link = new StringBuffer(linkName);
		link.append("^");
		link.append("javascript");
		link.append(":");
		link.append(scriptName);
		link.append("(");
		for (int i = 0; i < varname.length; i++) {
			String var = varname[i];
			if (i == 0) {
				link.append("\"" + var + "\"");
			} else {
				link.append(",\"" + var + "\"");
			}
		}
		link.append(")");
		link.append(";");
		link.append("^_self");
		return link.toString();
	}

	/**
	 * 生成超链接形式的单元格值。在不需要获取单元格的值的情况下，推荐使用这种方式。 如：<a href='javascript:void(0)'
	 * onclick=scriptName('" + var1 + "')>linkValue</a>
	 * 
	 * @param linkValue
	 * @param scriptName
	 * @param varname
	 * @return
	 */
	public static String renderURLValue(String linkValue, String scriptName,
			String... varname) {
		StringBuffer link = new StringBuffer(
				"<a href=\"javascript:void(0)\" onclick=");
		link.append(LINK_FUNCTION);
		link.append("(");
		for (int i = 0; i < varname.length; i++) {
			String var = "";
			try {
				var = URLEncoder.encode(varname[i], "utf-8");
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
			if (i == 0) {
				link.append("\"" + var + "\"");
			} else {
				link.append(",\"" + var + "\"");
			}
		}
		if (varname.length > 0) {
			link.append(",this");
		} else {
			link.append("this");
		}
		link.append(",\"" + scriptName + "\"");
		link.append(")");
		link.append(">");
		link.append(linkValue);
		link.append("</a>");
		return link.toString();
	}

	/**
	 * 获得下拉树组件的数据
	 * 
	 * @param codeCol
	 *            树关联的列名
	 * @param parentIdCol
	 *            树父层节点的列名
	 * @param nameCol
	 *            树显示的名称
	 * @param table
	 *            表或视图名称
	 * @param rootId
	 *            根节点ID
	 * @param orderCol
	 *            排序列名及方式，中间空格分隔
	 * @param filter
	 *            过滤条件，符合sql的where语法
	 * @return
	 */
	public static String getComboxTreeData(String codeCol, String parentIdCol,
			String nameCol, String table, String rootId, String orderCol,
			String filter) {
		String sql = "select " + codeCol + "," + parentIdCol + "," + nameCol
				+ " from " + table + " where " + filter + " start with "
				+ codeCol + " = '" + rootId + "' connect by prior " + codeCol
				+ " = " + parentIdCol + " order siblings by " + orderCol;
		List<Map<String, String>> list = JdbcUtil.query(sql);
		StringBuffer treeData = new StringBuffer();
		for (Map<String, String> map : list) {
			treeData.append(",[\'" + map.get(codeCol) + "\',");
			treeData.append("\'" + map.get(parentIdCol) + "\',");
			treeData.append("\'" + map.get(nameCol) + "\']");
		}
		String treeDataStr = "";
		if (treeData != null) {
			treeDataStr = "[" + treeData.substring(1) + "]";
		}
		return treeDataStr;
	}

	/**
	 * 将DataAction中的指定属性转换为数据库能够识别的时间格式字符串
	 * 
	 * @param dataAction
	 *            DataAction
	 * @param fields
	 *            属性字符串或字符串数组(可选)
	 * @param toFormats
	 *            时间格式字符串或字符串数组(可选)
	 * @param initValues
	 *            时间字设置初始值字符串或字符串数组(可选)
	 * @param dateTypes
	 *            时间类型：date/datetime（默认）字符串或字符串数组(可选/与toFormat参数二选一)
	 */
	public static void transConnectorModifyDateTime(DataAction dataAction,
			Object... params) {
		if (dataAction != null && params != null) {
			String field = null;
			String[] fields = null;
			String toFormat = null;
			String[] toFormats = null;
			String initValue = null;
			String[] initValues = null;
			String dateType = null;
			String[] dateTypes = null;
			int inx = 0;
			int[] params_lenght = new int[4];
			int params_lenght_max = 1;
			for (Object param : params) {
				if (inx > transConnectorMethodDefaultMaxParamsNum - 1)
					break;
				if (param != null && param.getClass().isArray()) {
					if (inx == 0) {
						fields = (String[]) param;
						params_lenght[inx] = fields.length;
					}
					if (inx == 1) {
						toFormats = (String[]) param;
						params_lenght[inx] = toFormats.length;
					}
					if (inx == 2) {
						initValues = (String[]) param;
						params_lenght[inx] = initValues.length;
					}
					if (inx == 3) {
						dateTypes = (String[]) param;
						params_lenght[inx] = dateTypes.length;
					}
				} else {
					params_lenght[inx] = 1;
					if (inx == 0)
						field = (String) param;
					if (inx == 1)
						toFormat = (String) param;
					if (inx == 2)
						initValue = (String) param;
					if (inx == 3)
						dateType = (String) param;
				}
				params_lenght_max = params_lenght_max < params_lenght[inx] ? params_lenght[inx]
						: params_lenght_max;
				inx++;
			}
			for (; inx < transConnectorMethodDefaultMaxParamsNum; inx++) {
				params_lenght[inx] = 0;
			}
			// for(int i:params_lenght)
			// System.out.println("params_lenght"+i);
			// System.out.println("params_lenght_max"+params_lenght_max);
			String fieldCopy = null;
			String toFormatCopy = null;
			String initValueCopy = null;
			String dateTypeCopy = null;
			for (int num = 0; num < params_lenght_max; num++) {
				if (params_lenght[0] == 1) {
					fieldCopy = field;
				} else {
					if (params_lenght[0] > num)
						fieldCopy = fields[num];
					else
						fieldCopy = null;
				}
				if (params_lenght[1] == 1) {
					toFormatCopy = toFormat;
				} else {
					if (params_lenght[1] > num)
						toFormatCopy = toFormats[num];
					else
						toFormatCopy = null;
				}
				if (params_lenght[2] == 1) {
					initValueCopy = initValue;
				} else {
					if (params_lenght[2] > num)
						initValueCopy = initValues[num];
					else
						initValueCopy = null;
				}
				if (params_lenght[3] == 1) {
					dateTypeCopy = dateType;
				} else {
					if (params_lenght[3] > num)
						dateTypeCopy = dateTypes[num];
					else
						dateTypeCopy = null;
				}
				transConnectorModifyDateTime(dataAction, fieldCopy,
						toFormatCopy, initValueCopy);
			}
		}
	}

	/**
	 * 将DataAction中的指定属性转换为数据库能够识别的时间格式字符串
	 * 
	 * @param dataAction
	 *            DataAction
	 * @param field
	 *            属性字符串(可选)
	 * @param toFormat
	 *            时间格式字符串(可选)
	 * @param initValue
	 *            时间字设置初始值字符串(可选)
	 * @param dateType
	 *            时间类型：date/datetime（默认）字符串(可选/与toFormat参数二选一)
	 */
	public static void transConnectorModifyDateTime(DataAction dataAction,
			String... params) {
		String field = null;
		String toFormat = null;
		String initValue = null;
		String dateType = "datetime";
		int inx = 0;
		for (Object param : params) {
			if (inx > transConnectorMethodDefaultMaxParamsNum - 1)
				break;

			if (inx == 0)
				field = (String) param;
			if (inx == 1)
				toFormat = (String) param;
			if (inx == 2)
				initValue = (String) param;
			if (inx == 3)
				dateType = (param == null || param.toString().trim().equals("") ? dateType
						: param.toString());
			inx++;
		}
		if (dataAction != null && field != null) {
			String value = dataAction.get_value(field);
			if (value != null && !value.trim().equals("")) {
				toFormat = (toFormat == null || toFormat.trim().equals("")) ? (dateType
						.trim().equalsIgnoreCase("datetime") ? formatDateTimeForOracle
						: formatDateForOracle)
						: toFormat;
				if (initValue == null || initValue.trim().equals(""))
					dataAction.set_value(field, "to_date('" + value + "','"
							+ toFormat + "')");
				else
					dataAction.set_value(field, "to_date('" + initValue + "','"
							+ toFormat + "')");
				// }else{
				// dataAction.set_value(field, "");
			}

		}
	}

	/**
	 * 将DataAction中的指定属性转换为数据库能够识别的时间格式字符串
	 * 
	 * @param dataAction
	 *            DataAction
	 * @param field
	 *            属性字符串(可选)
	 * @param toFormat
	 *            时间格式字符串(可选)
	 * @param initValue
	 *            时间字设置初始值字符串(可选)
	 * @param dateType
	 *            时间类型：date/datetime（默认）字符串(可选/与toFormat参数二选一)
	 */
	public static String getConnectorModifyDateTime(DataAction dataAction,
			String... params) {
		String field = null;
		String toFormat = null;
		String initValue = null;
		String dateType = "datetime";
		int inx = 0;
		for (Object param : params) {
			if (inx > transConnectorMethodDefaultMaxParamsNum - 1)
				break;

			if (inx == 0)
				field = (String) param;
			if (inx == 1)
				toFormat = (String) param;
			if (inx == 2)
				initValue = (String) param;
			if (inx == 3)
				dateType = (param == null || param.toString().trim().equals("") ? dateType
						: param.toString());
			inx++;
		}
		if (dataAction != null && field != null) {
			String value = dataAction.get_value(field);
			if (value != null && !value.trim().equals("")) {
				toFormat = (toFormat == null || toFormat.trim().equals("")) ? (dateType
						.trim().equalsIgnoreCase("datetime") ? formatDateTimeForOracle
						: formatDateForOracle)
						: toFormat;
				if (initValue == null || initValue.trim().equals(""))
					return "to_date('" + value + "','" + toFormat + "')";
				else
					return "to_date('" + initValue + "','" + toFormat + "')";
				// }else{
				// return "";
			}

		}
		return "";
	}

	/**
	 * 将DataItem中的一组属性转换为dhx前台组件能够识别的时间格式字符串
	 * 
	 * @param dataItem
	 *            DataItem
	 * @param fields
	 *            属性字符串或字符串数组(可选)
	 * @param toFormats
	 *            dhx前台组件需要的时间格式字符串或字符串数组(可选)
	 * @param fromFormats
	 *            dhx的connector中读取到的时间格式字符串或字符串数组(可选)
	 * @param dateTypes
	 *            时间类型：date/datetime（默认）字符串或字符串数组(可选/与toFormat参数二选一)
	 */
	public static void transConnectorQueryDateTime(DataItem dataItem,
			Object... params) {
		if (dataItem != null && params != null) {
			String field = null;
			String[] fields = null;
			String fromFormat = null;
			String[] fromFormats = null;
			String toFormat = null;
			String[] toFormats = null;
			String dateType = null;
			String[] dateTypes = null;
			int inx = 0;
			int[] params_lenght = new int[4];
			int params_lenght_max = 1;
			for (Object param : params) {
				if (inx > transConnectorMethodDefaultMaxParamsNum - 1)
					break;
				if (param != null && param.getClass().isArray()) {
					if (inx == 0) {
						fields = (String[]) param;
						params_lenght[inx] = fields.length;
					}
					if (inx == 1) {
						toFormats = (String[]) param;
						params_lenght[inx] = toFormats.length;
					}
					if (inx == 2) {
						fromFormats = (String[]) param;
						params_lenght[inx] = fromFormats.length;
					}
					if (inx == 3) {
						dateTypes = (String[]) param;
						params_lenght[inx] = dateTypes.length;
					}
				} else {
					params_lenght[inx] = 1;
					if (inx == 0)
						field = (String) param;
					if (inx == 1)
						toFormat = (String) param;
					if (inx == 2)
						fromFormat = (String) param;
					if (inx == 3)
						dateType = (String) param;
				}
				params_lenght_max = params_lenght_max < params_lenght[inx] ? params_lenght[inx]
						: params_lenght_max;
				inx++;
			}
			for (; inx < transConnectorMethodDefaultMaxParamsNum; inx++) {
				params_lenght[inx] = 0;
			}
			// for(int i:params_lenght)
			// System.out.println("params_lenght"+i);
			// System.out.println("params_lenght_max"+params_lenght_max);
			String fieldCopy = null;
			String toFormatCopy = null;
			String fromFormatCopy = null;
			String dateTypeCopy = null;
			for (int num = 0; num < params_lenght_max; num++) {
				if (params_lenght[0] == 1) {
					fieldCopy = field;
				} else {
					if (params_lenght[0] > num)
						fieldCopy = fields[num];
					else
						fieldCopy = null;
				}
				if (params_lenght[1] == 1) {
					toFormatCopy = toFormat;
				} else {
					if (params_lenght[1] > num)
						toFormatCopy = toFormats[num];
					else
						toFormatCopy = null;
				}
				if (params_lenght[2] == 1) {
					fromFormatCopy = fromFormat;
				} else {
					if (params_lenght[2] > num)
						fromFormatCopy = fromFormats[num];
					else
						fromFormatCopy = null;
				}
				if (params_lenght[3] == 1) {
					dateTypeCopy = dateType;
				} else {
					if (params_lenght[3] > num)
						dateTypeCopy = dateTypes[num];
					else
						dateTypeCopy = null;
				}
				transConnectorQueryDateTime(dataItem, fieldCopy, toFormatCopy,
						fromFormatCopy, dateTypeCopy);
			}
		}
	}

	/**
	 * 将DataItem中的指定属性转换为dhx前台组件能够识别的时间格式字符串
	 * 
	 * @param dataItem
	 *            DataItem
	 * @param field
	 *            属性字符串(可选)
	 * @param toFormat
	 *            dhx前台组件需要的时间格式字符串(可选)
	 * @param fromFormat
	 *            dhx的connector中读取到的时间格式字符串(可选)
	 * @param dateType
	 *            时间类型：date/datetime（默认）字符串(可选/与toFormat参数二选一)
	 */
	public static void transConnectorQueryDateTime(DataItem dataItem,
			String... params) {
		String field = null;
		String toFormat = null;
		String fromFormat = null;
		String dateType = "datetime";
		int inx = 0;
		for (Object param : params) {
			if (inx > transConnectorMethodDefaultMaxParamsNum - 1)
				break;

			if (inx == 0)
				field = (String) param;
			if (inx == 1)
				toFormat = (String) param;
			if (inx == 2)
				fromFormat = (String) param;
			if (inx == 3)
				dateType = (param == null || param.toString().trim().equals("") ? dateType
						: param.toString());
			inx++;
		}
		if (dataItem != null && field != null) {
			String value = dataItem.get_value(field);
			if (value != null && !value.trim().equals("")) {
				toFormat = (toFormat == null || toFormat.trim().equals("")) ? (dateType
						.trim().equalsIgnoreCase("datetime") ? formatDateTimeForDhxUi
						: formatDateForDhxUi)
						: toFormat;
				fromFormat = (fromFormat == null || fromFormat.trim()
						.equals("")) ? formatDateTimeForDhxConnector
						: fromFormat;
				String formatValue = "";
				SimpleDateFormat df = new SimpleDateFormat(fromFormat);
				try {
					formatValue = new SimpleDateFormat(toFormat).format(df
							.parse(value));
				} catch (ParseException e) {
					e.printStackTrace();
				}
				dataItem.set_value(field, formatValue);
				// }else{
				// dataItem.set_value(field, "");
			}
		}
	}

	/**
	 * 得到DataItem中的指定属性对应dhx前台组件能够识别的时间格式字符串
	 * 
	 * @param dataItem
	 *            DataItem
	 * @param field
	 *            属性字符串(可选)
	 * @param toFormat
	 *            dhx前台组件需要的时间格式字符串(可选)
	 * @param fromFormat
	 *            dhx的connector中读取到的时间格式字符串(可选)
	 * @param dateType
	 *            时间类型：date/datetime（默认）字符串(可选/与toFormat参数二选一)
	 * @return String 时间格式字符串
	 */
	public static String getConnectorQueryDateTime(DataItem dataItem,
			String... params) {
		String field = null;
		String toFormat = null;
		String fromFormat = null;
		String dateType = "datetime";
		int inx = 0;
		for (Object param : params) {
			if (inx > transConnectorMethodDefaultMaxParamsNum - 1)
				break;

			if (inx == 0)
				field = (String) param;
			if (inx == 1)
				toFormat = (String) param;
			if (inx == 2)
				fromFormat = (String) param;
			if (inx == 3)
				dateType = (param == null || param.toString().trim().equals("") ? dateType
						: param.toString());
			inx++;
		}
		if (dataItem != null && field != null) {
			String value = dataItem.get_value(field);
			if (value != null && !value.trim().equals("")) {
				toFormat = (toFormat == null || toFormat.trim().equals("")) ? (dateType
						.trim().equalsIgnoreCase("datetime") ? formatDateTimeForDhxUi
						: formatDateForDhxUi)
						: toFormat;
				fromFormat = (fromFormat == null || fromFormat.trim()
						.equals("")) ? formatDateTimeForDhxConnector
						: fromFormat;
				String formatValue = "";
				SimpleDateFormat df = new SimpleDateFormat(fromFormat);
				try {
					formatValue = new SimpleDateFormat(toFormat).format(df
							.parse(value));
				} catch (ParseException e) {
					e.printStackTrace();
				}
				return formatValue;
				// }else{
				// return "";
			}
		}
		return dateType;
	}

	/**
	 * 将List数据列表转换成dhtmlxGrid的XML数据格式。
	 * 数据列的结构根据columns参数生成，其中的列名为JavaBean的属性名，支持属性嵌套， 例如<tt>userData.date</tt>
	 * 类型的格式。
	 * 
	 * @param dataList
	 *            包含数据的List对象
	 * @param idColumn
	 *            主键列的属性名
	 * @param columns
	 *            需要显示的数据列结构数组，每一个元素为dataList中对象的属性名，支持嵌套格式， 比如当设置成
	 *            <tt>userData.date</tt>时，会自动查找对象的
	 *            <tt>getUserData().getDate()</tt>方法
	 * @return
	 */
	public static String generateGridDataXml(List<?> dataList, String idColumn,
			String[] columns) throws SecurityException,
			IllegalArgumentException, NoSuchFieldException,
			IllegalAccessException, InvocationTargetException,
			NoSuchMethodException {
		return generateGridDataXml(dataList, idColumn, columns, null, null,
				null);
	}

	public static String generateGridDataXml(List<?> dataList, String idColumn,
			String[] columns, String[] userDataColumns)
			throws SecurityException, NoSuchFieldException,
			IllegalArgumentException, IllegalAccessException,
			InvocationTargetException, NoSuchMethodException {
		return generateGridDataXml(dataList, idColumn, columns,
				userDataColumns, null, null);
	}

	/**
	 * 将List数据列表转换成dhtmlxGrid的XML数据格式。
	 * 数据列的结构根据columns参数生成，其中的列名为JavaBean的属性名，支持属性嵌套， 例如<tt>userData.date</tt>
	 * 类型的格式。
	 * 
	 * @param dataList
	 *            包含数据的List对象
	 * @param idColumn
	 *            主键列的属性名
	 * @param columns
	 *            需要显示的数据列结构数组，每一个元素为dataList中对象的属性名，支持嵌套格式， 比如当设置成
	 *            <tt>userData.date</tt>时，会自动查找对象的
	 *            <tt>getUserData().getDate()</tt>方法
	 * @param userDataColumns
	 *            userdata列数组，该数组中的列会生成<tt>&lt;userdata&gt;标签添加到每行中</tt>
	 * @return
	 */
	public static String generateGridDataXml(List<?> dataList, String idColumn,
			String[] columns, String[] userDataColumns, Integer totalCnt,
			Integer pos) throws SecurityException, NoSuchFieldException,
			IllegalArgumentException, IllegalAccessException,
			InvocationTargetException, NoSuchMethodException {
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");

		Document document = DocumentHelper.createDocument();
		Element rootel = document.addElement("rows");
		if (totalCnt != null && pos != null) {
			rootel.addAttribute("total_count", totalCnt.toString());
			rootel.addAttribute("pos", pos.toString());
		}

		if (dataList.size() > 0) {
			Class objectClass = dataList.get(0).getClass();
			// Method[] getters = new Method[columns.length];
			Map<String, String[]> getterMap = new HashMap<String, String[]>();
			if (!Map.class.isAssignableFrom(objectClass)) {

				for (int i = 0; i < columns.length; i++) {
					String col = columns[i];
					String[] methodNames = convertPropertyToGetterNames(col);
					getterMap.put(col, methodNames);

				}
				// id的Getter
				if (idColumn != null) {

					String[] idMethodNames = convertPropertyToGetterNames(idColumn);
					getterMap.put(idColumn, idMethodNames);

				}
				if (userDataColumns != null) {
					for (int j = 0; j < userDataColumns.length; j++) {
						String col = userDataColumns[j];
						String[] methodNames = convertPropertyToGetterNames(col);
						getterMap.put(col, methodNames);

					}
				}
			}

			for (int j = 0; j < dataList.size(); j++) {
				Object obj = dataList.get(j);
				Element row = rootel.addElement("row");
				// 添加ID
				if (idColumn != null) {
					String keyValue = "";
					if (Map.class.isAssignableFrom(objectClass)) {
						Map<String, Object> currentMap = (Map<String, Object>) obj;
						keyValue = currentMap.get(idColumn) == null ? ""
								: currentMap.get(idColumn).toString();
					} else {
						String[] keyMethodNames = getterMap.get(idColumn);
						Object currentObj = obj;
						for (String methodName : keyMethodNames) {
							if (methodName.equals("#rownum")) {
								currentObj = j + 1;
							} else {

								Method currentMethod = currentObj.getClass()
										.getMethod(methodName);
								currentObj = currentMethod.invoke(currentObj);
							}

						}

						if (currentObj != null) {
							keyValue = currentObj == null ? "" : currentObj
									.toString();
						}
					}
					if (!keyValue.equals(""))
						row.addAttribute("id", keyValue);
				}
				if (userDataColumns != null) {
					for (int i = 0; i < userDataColumns.length; i++) {
						String col = userDataColumns[i];
						String value = "";
						if (Map.class.isAssignableFrom(objectClass)) {
							Map<String, Object> currentMap = (Map<String, Object>) obj;
							Object valueObj = currentMap.get(col);
							if (valueObj != null) {
								if (Date.class.isAssignableFrom(valueObj
										.getClass())) {
									value = dateFormat.format((Date) valueObj);
								} else
									value = valueObj == null ? "" : valueObj
											.toString();
							}
						} else {
							String[] methoNames = getterMap.get(col);
							Object currentObj = obj;
							for (String methodName : methoNames) {
								if (methodName.equals("#rownum")) {
									currentObj = j + 1;
								} else if (currentObj != null) {
									Method currentMethod = currentObj
											.getClass().getMethod(methodName);
									currentObj = currentMethod
											.invoke(currentObj);
								}
							}

							if (currentObj != null) {
								if (Date.class.isAssignableFrom(currentObj
										.getClass())) {
									value = dateFormat
											.format((Date) currentObj);
								} else
									value = currentObj == null ? ""
											: currentObj.toString();
							}
						}

						Element cell = row.addElement("userdata");
						cell.addAttribute("name", col);
						cell.addText(value);
					}
				}
				for (int i = 0; i < columns.length; i++) {
					String col = columns[i];
					String value = "";
					if (Map.class.isAssignableFrom(objectClass)) {
						Map<String, Object> currentMap = (Map<String, Object>) obj;
						Object valueObj = null;
						if (col.startsWith("#")) {
							if (col.equals("#cb")) {
								valueObj = 0;
							} else if (col.equals("#rownum")) {
								valueObj = j + 1;
							}
						} else {
							valueObj = currentMap.get(col);
						}

						if (valueObj != null) {
							if (Date.class
									.isAssignableFrom(valueObj.getClass())) {
								value = dateFormat.format((Date) valueObj);
							} else
								value = valueObj == null ? "" : valueObj
										.toString();
						}
					} else {
						String[] methoNames = getterMap.get(col);
						Object currentObj = obj;
						for (String methodName : methoNames) {
							if (methodName.startsWith("#")) {
								if (methodName.equals("#cb")) {
									currentObj = 0;
								} else if (methodName.equals("#rownum")) {
									currentObj = j + 1;
								}
							} else if (currentObj != null) {
								Method currentMethod = currentObj.getClass()
										.getMethod(methodName);
								currentObj = currentMethod.invoke(currentObj);
							}
						}

						if (currentObj != null) {
							if (Date.class.isAssignableFrom(currentObj
									.getClass())) {
								value = dateFormat.format((Date) currentObj);
							} else
								value = currentObj == null ? "" : currentObj
										.toString();
						}
					}

					Element cell = row.addElement("cell");
					cell.addCDATA(value);
				}

			}

		}

		return document.asXML();
	}

	private static String[] convertPropertyToGetterNames(String property) {
		if (property.indexOf("#") != -1) {
			return new String[] { property };
		} else {
			String[] colArr = property.split("\\.");
			String[] methodNames = new String[colArr.length];
			for (int j = 0; j < colArr.length; j++) {
				String subCol = colArr[j];
				String methodName = "get"
						+ subCol.substring(0, 1).toUpperCase()
						+ subCol.substring(1);
				// Method getter = objectClass.getMethod(methodName);
				methodNames[j] = methodName;
			}
			return methodNames;
		}

	}

	/**
	 * 将List数据列表转换成dhtmlxCombo的XML数据格式。 List中的对象可以是JavaBean，也可以是Map对象
	 * 数据列的结构根据columns参数生成，其中的列名为JavaBean的属性名或Map的key。当对象是JavaBean时支持属性嵌套， 例如
	 * <tt>userData.date</tt>类型的格式。
	 * 
	 * @param dataList
	 *            包含数据的List对象，其中的元素可以是JavaBean或者Map对象
	 * @param displayField
	 *            combo中选项显示值的属性名
	 * @param valueField
	 *            combo中选项value的属性名
	 * @param selectIndex
	 *            默认选中项的下标
	 * @return dhtmlxCombo的XML格式字符串
	 */
	@SuppressWarnings("unchecked")
	public static String generateComboDataXml(List<?> dataList,
			String displayField, String valueField, int selectIndex)
			throws SecurityException, NoSuchFieldException,
			IllegalArgumentException, IllegalAccessException,
			InvocationTargetException, NoSuchMethodException {
		Document document = DocumentHelper.createDocument();
		Element rootel = document.addElement("complete");
		String[] displayMethodNames = convertPropertyToGetterNames(displayField);
		String[] valueMethodNames = convertPropertyToGetterNames(valueField);
		if (dataList.size() > 0) {
			Class objectClass = dataList.get(0).getClass();

			for (int j = 0; j < dataList.size(); j++) {
				Object obj = dataList.get(j);
				Element option = rootel.addElement("option");
				String displayStr = "";
				String valueStr = "";

				if (Map.class.isAssignableFrom(objectClass)) {

					Map<String, Object> currentMap = (Map<String, Object>) dataList
							.get(j);
					displayStr = currentMap.get(displayField) == null ? ""
							: currentMap.get(displayField).toString();
					valueStr = currentMap.get(valueField) == null ? ""
							: currentMap.get(valueField).toString();

				} else {

					Object displayObj = obj;
					Object valueObj = obj;
					for (String methodName : displayMethodNames) {
						Method currentMethod = displayObj.getClass().getMethod(
								methodName);
						displayObj = currentMethod.invoke(displayObj);
					}
					for (String methodName : valueMethodNames) {
						Method currentMethod = valueObj.getClass().getMethod(
								methodName);
						valueObj = currentMethod.invoke(valueObj);
					}

					if (displayObj != null) {
						displayStr = displayObj == null ? "" : displayObj
								.toString();
					}
					if (valueObj != null) {
						valueStr = valueObj == null ? "" : valueObj.toString();
					}
				}

				if (j == selectIndex) {
					option.addAttribute("selected", "true");
				}

				option.addAttribute("value", valueStr);

				option.addText(displayStr);

			}

		}
		return document.asXML();
	}


}

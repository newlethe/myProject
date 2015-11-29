package com.sgepit.frame.dataexchange.service;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.xml.messaging.URLEndpoint;
import javax.xml.soap.AttachmentPart;
import javax.xml.soap.MessageFactory;
import javax.xml.soap.SOAPBody;
import javax.xml.soap.SOAPConnection;
import javax.xml.soap.SOAPConnectionFactory;
import javax.xml.soap.SOAPElement;
import javax.xml.soap.SOAPEnvelope;
import javax.xml.soap.SOAPException;
import javax.xml.soap.SOAPMessage;
import javax.xml.soap.SOAPPart;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipOutputStream;
import org.dom4j.Document;
import org.dom4j.DocumentFactory;
import org.dom4j.Element;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.XMLWriter;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.hibernate.mapping.Column;
import org.hibernate.mapping.Component;
import org.hibernate.mapping.PersistentClass;
import org.hibernate.mapping.Property;
import org.hibernate.property.Getter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.orm.hibernate3.LocalSessionFactoryBean;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.base.env.HibernateSessionFactory;
import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.dataexchange.PCDataExchangeException;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;
import com.sgepit.frame.dataexchange.hbm.PcDataExchangeLog;
import com.sgepit.frame.dataexchange.hbm.PcDataExchangeLogDetail;
import com.sgepit.frame.dataexchange.hbm.VPcUserConsCols;
import com.sgepit.frame.dataexchange.hbm.VPcUserTabCols;
import com.sgepit.frame.sysman.hbm.SgccAttachList;
import com.sgepit.frame.sysman.hbm.SgccIniUnit;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.Log4jInit;
import com.sgepit.frame.util.db.SnUtil;

public class PCDataExchangeServiceImpl extends BaseMgmImpl implements
		PCDataExchangeService {
	Log log = LogFactory.getLog(PCDataExchangeServiceImpl.class);
	private BaseDAO baseDAO;
	private Configuration hc;
	/**
	 * 是否为调试模式
	 */
	private boolean debug;
	/**
	 * 定时发送时，每条消息里的记录行数
	 */
	private int recPerTrans;
	/**
	 * 定时发送时，允许发送失败的次数（超过次数则忽略不再发送）
	 */
	private int retryLimit;
	/**
	 * 读写文件时缓冲区大小
	 */
	private int bufferSize;
	/**
	 * Servlet名称，取PID对应的发送地址使用
	 */
	private String servletName = "servlet/PCDataExchangeServlet";
	/**
	 * 数据交换是否启用（开关，从属性文件中获取）
	 */
	private boolean exchangeEnabled = false;

	public int getRecPerTrans() {
		return recPerTrans;
	}

	public void setRecPerTrans(int recPerTrans) {
		this.recPerTrans = recPerTrans;
	}

	public int getRetryLimit() {
		return retryLimit;
	}

	public void setRetryLimit(int retryLimit) {
		this.retryLimit = retryLimit;
	}

	public BaseDAO getBaseDAO() {
		return baseDAO;
	}

	public void setBaseDAO(BaseDAO baseDAO) {
		this.baseDAO = baseDAO;
	}

	public boolean isDebug() {
		return debug;
	}

	public void setDebug(boolean debug) {
		this.debug = debug;
	}

	public int getBufferSize() {
		return bufferSize;
	}

	public void setBufferSize(int bufferSize) {
		this.bufferSize = bufferSize;
	}

	public void initHibernateConfiguration() {
		LocalSessionFactoryBean LocalSessionFactoryBean = (LocalSessionFactoryBean) Constant.wact
				.getBean("&sessionFactory1");
		this.hc = LocalSessionFactoryBean.getConfiguration();
	}

	public PCDataExchangeServiceImpl() {
		InputStream is = null;

		try {
			is = PCDataExchangeServiceImpl.class.getResourceAsStream("/system.properties");
			java.util.Properties p = new java.util.Properties();
			p.load(is);
			String enableStr = p.getProperty("ENABLE_DATA_EXCHANGE");
			if (enableStr != null) {
				if (enableStr.equals("1")) {
					exchangeEnabled = true;
				}
			}
		} catch (Exception e) {
			log.error(Constant.getTrace(e));
			e.printStackTrace();
		} finally {
			try {
				is.close();
			} catch (IOException e) {
				log.error(Constant.getTrace(e));
				e.printStackTrace();
			}
		}
	}

	@SuppressWarnings("rawtypes")
	public static final Comparator sort = new Comparator() {
		public int compare(Object arg0, Object arg1) {
			if (arg0 instanceof JSONObject && arg1 instanceof JSONObject) {
				JSONObject o0 = (JSONObject) arg0;
				JSONObject o1 = (JSONObject) arg1;
				if (o0.size() == 1 && o1.size() == 1) {
					String k0 = o0.keySet().iterator().next().toString();
					String k1 = o1.keySet().iterator().next().toString();

					return k0.compareTo(k1);
				} else {
					return 0;
				}
			}
			if (arg0 instanceof PcDataExchange
					&& arg1 instanceof PcDataExchange) {
				return ((PcDataExchange) arg0).getXh().intValue()
						- ((PcDataExchange) arg1).getXh().intValue();
			}
			return 0;
		}
	};
	/**
	 * 获取SOAP连接
	 * @return
	 * @throws UnsupportedOperationException
	 * @throws SOAPException
	 */
	public SOAPConnection getSOAPConnection()
			throws UnsupportedOperationException, SOAPException {
		SOAPConnectionFactory soapConnFactory = SOAPConnectionFactory.newInstance();
		SOAPConnection connection = soapConnFactory.createConnection();
		return connection;
	}
	/**
	 * 生成SQL语句，调试页面输出SQL语句专用 使用此方法每次都要查找表的结构信息，效率较低。
	 * 在程序内部发送多条数据循环调用时，应该事先将相同表的结构信息储存在Map中 使用createMergeSQL(PcDataExchange
	 * pcDataExchange, Map<String, Map<String, String>> tableMetaMap)方法 进行调用
	 * @param pcDataExchange
	 * @return
	 */
	public String createMergeSQL(PcDataExchange pcDataExchange) {
		String tableName = pcDataExchange.getTableName();
		Map<String, Map<String, String>> tableMetaMap = getTableMetaMap(tableName);
		return createMergeSQL(pcDataExchange, tableMetaMap);
	}
	/**
	 * 生成SQL语句
	 * @param bean
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public String createMergeSQL(PcDataExchange pcDataExchange,
			Map<String, Map<String, String>> tableMetaMap)
			throws PCDataExchangeException {
		// Merge语句
		StringBuilder mergeSQL = new StringBuilder();
		try {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
			// 需要报送的数据对应的表名
			String tableName = pcDataExchange.getTableName();
			Map<String, String> pkmap = tableMetaMap.get("pkmap");
			Map<String, String> ukmap = tableMetaMap.get("ukmap");
			Map<String, String> colmap = tableMetaMap.get("colmap");

			// 没有主键，不允许数据交互
			if (!pkmap.isEmpty() && pcDataExchange.getKeyValue() != null) {

				String sqlWhere = getQuerySQLWhere(pcDataExchange, pkmap);
				List lt = JdbcUtil.query("select * from " + tableName
						+ " where " + sqlWhere);
				if (lt.size() == 1) {
					// 待报送的数据,Map<字段名称，数值>
					Map kvMap = (Map) lt.get(0);
					// Merge语句中的tab2表部分
					StringBuilder tab2 = new StringBuilder();
					// Merge语句中的ON部分
					StringBuilder on = new StringBuilder();
					// Merge语句中的set部分
					StringBuilder set = new StringBuilder();
					// Merge语句中的columns部分
					StringBuilder columns = new StringBuilder();
					// Merge语句中的values部分
					StringBuilder values = new StringBuilder();
					// on内容拼写
					Map<String, String> onmap = null;
					if (ukmap.isEmpty()) {// 唯一约束不存在时，以主键列为匹配条件
						onmap = pkmap;
					} else {// 唯一约束存在时，以唯一约束列为匹配条件
						onmap = ukmap;
					}
					for (Iterator it = onmap.keySet().iterator(); it.hasNext();) {
						String colName = (String) it.next();
						on.append("and tab1.").append(colName).append("=")
								.append("tab2.").append(colName).append(" ");
					}

					for (Iterator<String> it = colmap.keySet().iterator(); it
							.hasNext();) {
						String colName = it.next();// 字段名称
						String colType = colmap.get(colName);// 字段类型
						Object value = kvMap.get(colName);
						// tab2内容拼写
						if (value == null) {
							tab2.append(",null as ");
							tab2.append(colName);
						} else {// 注意数据类型
							if (colType.startsWith("VARCHAR")) {
								tab2.append(",'").append(value.toString())
										.append("' as ").append(colName);
							} else if (colType.startsWith("DATE")) {
								tab2.append(",to_date('").append(
										sdf.format((Date) value)).append(
										"','yyyymmddhh24miss') as ").append(
										colName);
							} else if (colType.startsWith("NUMBER")) {
								tab2.append(",").append((BigDecimal) value)
										.append(" as ").append(colName);
							}
						}
						if (colType.startsWith("VARCHAR")
								|| colType.startsWith("DATE")
								|| colType.startsWith("NUMBER")) {
							// set内容拼写
							if (!ukmap.isEmpty()) {
								if (!ukmap.containsKey(colName)) {
									set.append(",tab1.").append(colName)
											.append("=tab2.").append(colName);
								}
							} else {
								if (!pkmap.containsKey(colName)) {
									set.append(",tab1.").append(colName)
											.append("=tab2.").append(colName);
								}
							}
							// columns内容拼写
							columns.append(",").append(colName);
							// values内容拼写
							values.append(",tab2.").append(colName);
						}
					}
					if (tab2.length() > 0)
						tab2 = tab2.deleteCharAt(0);// 以","开头，剔除开头的","
					if (on.length() > 0)
						on = on.delete(0, 3);// 以"and"开头，剔除开头的"and"
					if (set.length() > 0)
						set = set.deleteCharAt(0);// 以","开头，剔除开头的","
					if (columns.length() > 0)
						columns = columns.deleteCharAt(0);// 以","开头，剔除开头的","
					if (values.length() > 0)
						values = values.deleteCharAt(0);// 以","开头，剔除开头的","

					if (tab2.length() > 0 && on.length() > 0 && on.length() > 0
							&& columns.length() > 0 && values.length() > 0) {
						mergeSQL.append("MERGE into ").append(tableName)
								.append(" tab1 USING (select ").append(tab2)
								.append(" from dual) tab2 on (").append(on)
								.append(")");
						// 若set部分为空(比如只有主键和blob字段的表SGCC_ATTACH_BLOB)则不需要when
						// matched部分
						if (set.length() > 0) {
							mergeSQL.append(" when matched then update set ")
									.append(set);
						}
						mergeSQL.append(" when not matched then insert (")
								.append(columns).append(") values (").append(
										values).append(")");
					} else {
						throw new PCDataExchangeException(
								"无法生成当前数据交换对象的插入/更新语句");
					}
				}// end if
				else { // 如果没有查到相应的数据即是删除数据
					mergeSQL.append("delete from " + tableName + " where "
							+ sqlWhere);
				}
			}// end !pkmap.isEmpty()
			else {
				throw new PCDataExchangeException("当前实体没有主键，无法转换SQL语句!");
			}
		} catch (Exception e) {
			log.error(Constant.getTrace(e));
			e.printStackTrace();
		}
		return (mergeSQL.length() > 0 ? mergeSQL.toString() : null);
	}

	/**
	 * 获取表的主键，返回值的类型是HashMap，key存放字段的名称，value存放字段的数据类型
	 * @param tableName      表名
	 * @return
	 */
	public HashMap<String, String> getPrimaryKeyByTableName(String tableName) {
		HashMap<String, String> pkeys = new HashMap<String, String>();

		if (tableName != null && !tableName.equals("")) {
			List list = baseDAO.findByWhere(
					com.sgepit.frame.dataexchange.hbm.VPcUserConsCols.class
							.getName(), "table_name='"
							+ tableName.toUpperCase()
							+ "' and constraint_type='P'");
			for (int i = 0; i < list.size(); i++) {
				VPcUserConsCols hbm = (VPcUserConsCols) list.get(i);
				pkeys.put(hbm.getId().getColumnName(), hbm.getDataType());
			}
		}
		return pkeys;
	}

	/**
	 * 获取表的唯一约束列，返回值的类型是HashMap，key存放字段的名称，value存放字段的数据类型
	 * @param tableName     表名
	 * @return
	 */
	public HashMap<String, String> getUniqueKeyByTableName(String tableName) {
		HashMap<String, String> ukeys = new HashMap<String, String>();
		if (tableName != null && !tableName.equals("")) {
			List list = baseDAO.findByWhere(VPcUserConsCols.class.getName(),
					"table_name='" + tableName.toUpperCase()
							+ "' and constraint_type='U'");
			for (int i = 0; i < list.size(); i++) {
				VPcUserConsCols hbm = (VPcUserConsCols) list.get(i);
				ukeys.put(hbm.getId().getColumnName(), hbm.getDataType());
			}
		}
		return ukeys;
	}

	/**
	 * 查询表的列信息，包括字段名称和数据类型
	 * @param tableName
	 * @return
	 */
	public Map<String, String> getColumnsByTableName(String tableName) {
		HashMap<String, String> cols = new HashMap<String, String>();

		if (tableName != null && !tableName.equals("")) {
			List list = baseDAO.findByWhere(VPcUserTabCols.class.getName(),
					"table_name='" + tableName.toUpperCase() + "'");
			for (int i = 0; i < list.size(); i++) {
				VPcUserTabCols hbm = (VPcUserTabCols) list.get(i);
				cols.put(hbm.getId().getColumnName(), hbm.getId().getDataType());
			}
		}
		return cols;
	}

	/**
	 * 由主键列名及数值，生成过滤条件
	 * @param pcDataExchange
	 * @return
	 */
	public String getQuerySQLWhere(PcDataExchange pcDataExchange, Map<String, String> pkmap) {
		if ( pkmap == null ){
			pkmap = getPrimaryKeyByTableName(pcDataExchange
					.getTableName());
		}
		// 待报送数据主键值
		JSONArray kvarr = JSONArray.fromObject(pcDataExchange.getKeyValue());
		JSONObject kv = new JSONObject();
		boolean allEmpty = true;
		for (int i = 0; i < kvarr.size(); i++) {
			JSONObject tmp = kvarr.getJSONObject(i);
			if ( !tmp.isEmpty() ){
				allEmpty = false;
			}
			kv.putAll(tmp);
		}
		if ( allEmpty ){
			log.error(Constant.getTrace(new PCDataExchangeException("主键标识没有任何值！")));
			throw new PCDataExchangeException("主键标识没有任何值！");
		}
		// 待报送数据查询SQL
		StringBuilder where = new StringBuilder();
		// 遍历主键,添加过滤
		for (Iterator<String> it = pkmap.keySet().iterator(); it.hasNext();) {
			String colName = it.next();
			String colType = pkmap.get(colName);
			if (kv.get(colName) == null) {// 主键对应的值为空
				where.append("and ").append(colName).append(" is null ");
			} else {// 不为空时需要主键数据类型
				if (colType.startsWith("VARCHAR")) {
					where.append("and ").append(colName).append("='").append(
							kv.get(colName).toString()).append("' ");
				} else if (colType.startsWith("DATE")) {
					where.append("and to_char(").append(colName);
					where.append(",'yyyymmddhh24miss')='");
					where.append(kv.get(colName).toString());
					where.append("' ");
				} else if (colType.startsWith("NUMBER")) {
					where.append("and ").append(colName).append("=").append(
							kv.get(colName).toString()).append(" ");
				}
			}
		}
		if (where.length() > 0)
			where.delete(0, 3);
		return where.toString();
	}
	/**
	 * 由给定的业务bean和bean的名称生成待发送队列数据（注意：不支持没有hibernate映射的bean数据）
	 * @param obj 业务对象bean
	 * @param pid 项目编号
	 * @param txGroup 事务组编号
	 * @param xh 排序
	 * @return
	 */
	public PcDataExchange converBean(Object obj, String pid,
			String txGroup, Long xh){
		return converBean(obj, pid, txGroup, xh,null, null);
	}
	
	@SuppressWarnings("unchecked")
	private PcDataExchange converBean(Object obj, String pid,
			String txGroup, Long xh,PersistentClass pc, Map<String, List> metaMap) {
			PcDataExchange dataChange = new PcDataExchange();
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
			JSONArray kvarr = new JSONArray();
			String entityName = obj.getClass().getName();
			if ( pc == null ){		
				pc = getPersistentClassByEntityName(entityName);
			}
			if (pc == null) {
				throw new PCDataExchangeException(entityName + "找不到对应的映射文件");
			}

			Property idp = pc.getIdentifierProperty();

			if (idp.isComposite()) {// 联合主键
				Iterator it = pc.getKeyClosureIterator();
				if (it.hasNext()) {
					Getter idget = idp.getGetter(obj.getClass());// 获取主键值的getter方法
					Class idtype = idget.getReturnType();// 主键类

					Component com = (Component) it.next();
					Iterator<Property> it1 = com.getPropertyIterator();
					for (; it1.hasNext();) {
						JSONObject kv = new JSONObject();
						Property p = it1.next();
						Column c = ((Column) p.getColumnIterator().next());
						String colName = c.getName().toUpperCase();
						Getter getter = p.getGetter(idtype);
						String javatype = getter.getReturnType().getName();
						Object value = getter.get(idget.get(obj));

						if (javatype.endsWith("String")
								|| javatype.endsWith("Double")
								|| javatype.endsWith("Long")) {
							kv.put(colName, value);
						} else if (javatype.endsWith("Date")) {
							kv.put(colName, sdf.format(value));
						}
						kvarr.add(kv);
					}
				}
			} else {
				Column c = ((Column) idp.getColumnIterator().next());
				String colName = c.getName().toUpperCase();
				Getter getter = idp.getGetter(obj.getClass());
				String javatype = getter.getReturnType().getName();
				JSONObject kv = new JSONObject();
				if (javatype.endsWith("String") || javatype.endsWith("Double")
						|| javatype.endsWith("Long")) {
					kv.put(colName, getter.get(obj));
				} else if (javatype.endsWith("Date")) {
					kv.put(colName, sdf.format(getter.get(obj)));
				}
				kvarr.add(kv);
			}

			Collections.sort(kvarr, sort);// 排个序

			String blobCol = null;
			List blobList = null;
			String tableName = pc.getTable().getName().toUpperCase();
			if ( metaMap != null ){
				blobList = metaMap.get("blob");
			}
			
			if ( blobList == null ){
				
				blobList = baseDAO.findByWhere(VPcUserTabCols.class.getName(),
						"table_name='" + tableName + "' AND DATA_TYPE='BLOB'");
			}
			
			if (blobList.size() > 0) {
				VPcUserTabCols hbm = (VPcUserTabCols) blobList.get(0);
				blobCol = hbm.getId().getColumnName();
			}

			// Clob和Long
			String clobCol = null;
			List clobList = null;
			if ( metaMap != null ){
				clobList = metaMap.get("clob");
			}
			if ( clobList == null ){
				clobList = baseDAO.findByWhere(VPcUserTabCols.class.getName(),
						"table_name='" + tableName
								+ "' AND DATA_TYPE in ('CLOB', 'LONG')");
			}
			
			if (clobList.size() > 0) {
				VPcUserTabCols hbm2 = (VPcUserTabCols) clobList.get(0);
				clobCol = hbm2.getId().getColumnName();
			}

			dataChange.setKeyValue(kvarr.toString());// 主键键值对JSON串
			dataChange.setTableName(tableName);// 表名
			dataChange.setBlobCol(blobCol);// BLOB对应的列名
			dataChange.setClobCol(clobCol);// CLOB,LONG对应的列名
			dataChange.setSuccessFlag("0");
			dataChange.setPid(pid);
			dataChange.setTxGroup(txGroup);
			dataChange.setXh(xh);

			return dataChange;

	}
	/**
	 * 生成SOAPMessage
	 * 
	 * @param list
	 *            List<List<PcDataExchange>>
	 * @return
	 */
	public SOAPMessage getMsgMessage(List<List<PcDataExchange>> list,
			Map<String, List<PcDataExchangeLogDetail>> logDetailMap) {
		SOAPMessage soapMessage = null;
		JdbcTemplate jdbcTemplate = null;
		Connection conn = null;
		ZipOutputStream zout = null;
		List<File> allFileList = new ArrayList<File>(); // 存放所有的文件，便于执行结束后删除

		// 存放所有表信息的map,键：表名，value： pkMap主键Map，ukMap唯一约束Map和colMap列信息map
		Map<String, Map<String, Map<String, String>>> tableMetaMap = new HashMap<String, Map<String, Map<String, String>>>();

		try {
			String tempdir = Constant.AppRootDir.concat(Constant.TEMPFOLDER).concat("/").replace("\\", "//");
			soapMessage = MessageFactory.newInstance().createMessage();
			SOAPPart soapPart = soapMessage.getSOAPPart();
			SOAPEnvelope requestEnvelope = soapPart.getEnvelope();
			SOAPBody body = requestEnvelope.getBody();

			Document doc = DocumentFactory.getInstance().createDocument();
			Element data = doc.addElement("data");

			String zipName = SnUtil.getNewID().concat(".zip");
			File zip = new File(tempdir.concat(zipName));
			allFileList.add(zip);
			zout = new ZipOutputStream(zip);
			zout.setEncoding("UTF-8");

			for (int i = 0, j = list.size(); i < j; i++) {
				List<PcDataExchange> lt = list.get(i);
				Element tx = data.addElement("tx");
				tx.addAttribute("index", String.valueOf(i + 1)); // 索引号
				Element sqlBefore = tx.addElement("sqlBefore"); // 前置SQL
				Element sqlAfter = tx.addElement("sqlAfter"); // 后置SQL
				Element bizInfo = tx.addElement("bizInfo"); // 业务简述
				Element formUnit = tx.addElement("from"); // 发送单位
				Element toUnit = tx.addElement("to"); // 接收单位
				Element rows = tx.addElement("rows");
				String curTxGroup = "";
				if (lt.size() > 0) {
					curTxGroup = lt.get(0).getTxGroup();
				} else {
					continue;
				}
				// 日志详细信息List
				List<PcDataExchangeLogDetail> detailList = new ArrayList<PcDataExchangeLogDetail>();
				for (int m = 0, n = lt.size(); m < n; m++) {
					PcDataExchange hbm = lt.get(m);
					String tableName = hbm.getTableName();
					if (tableMetaMap.get(tableName) == null) {
						tableMetaMap.put(tableName, getTableMetaMap(tableName));
					}

					if (m == 0) {
						tx.addAttribute("id", hbm.getTxGroup());
						if (hbm.getSpareC1() != null) {
							if (!hbm.getSpareC1().equals("")) {
								String[] sqls = hbm.getSpareC1().split(";");
								for (int k = 0; k < sqls.length; k++) {
									Element curSql = sqlBefore
											.addElement("sql");
									curSql.addAttribute("id", String
											.valueOf(k + 1));
									curSql.addCDATA(sqls[k]);
								}
							}
						}
						if (hbm.getSpareC2() != null) {
							if (!hbm.getSpareC2().equals("")) {
								String[] sqls = hbm.getSpareC2().split(";");
								for (int k = 0; k < sqls.length; k++) {
									Element curSql = sqlAfter.addElement("sql");
									curSql.addAttribute("id", String
											.valueOf(k + 1));
									curSql.addCDATA(sqls[k]);
								}
							}
						}
						if (hbm.getBizInfo() != null) {
							if (!hbm.getBizInfo().equals("")) {
								bizInfo.addCDATA(hbm.getBizInfo());
							}
						}
						if (hbm.getSpareC5() != null&&!(hbm.getSpareC5().equals(""))) {//发送单位
								formUnit.addCDATA(hbm.getSpareC5());
						}else{
							formUnit.addCDATA("未知");
						}
						if (hbm.getPid() != null&&!(hbm.getPid().equals(""))) {//接收单位
							toUnit.addCDATA(hbm.getPid());
						}else{
							toUnit.addCDATA("未知");
						}
					}
					String mergeSQL = null;
					String sqlError = null;
					if (hbm.getSqlData() != null
							&& !hbm.getSqlData().equals("")) {
						mergeSQL = hbm.getSqlData();
					} else {
						try {
							mergeSQL = createMergeSQL(hbm, tableMetaMap
									.get(tableName));
						} catch (PCDataExchangeException e) {
							log.error(Constant.getTrace(e));
							sqlError = e.getMessage();
						}
					}
					// 生成当前数据行的日志
					PcDataExchangeLogDetail detail = new PcDataExchangeLogDetail();
					detail.setTxGroupId(curTxGroup);
					detail.setSqlData(mergeSQL);
					detail.setErrorMessage(sqlError);
					detailList.add(detail);

					if (mergeSQL != null && !mergeSQL.equals("")) {
						Element row = rows.addElement("row");
						row.addAttribute("index", String.valueOf(m + 1));

						Element mergeSql = row.addElement("mergeSql");
						Element updateSql = row.addElement("updateSql");
						Element fileName = row.addElement("fileName");

						mergeSql.addCDATA(mergeSQL);

						String updatesql = "";
						String filename = "";

						String blobCol = hbm.getBlobCol();
						if (blobCol != null && !blobCol.equals("")) {
							blobCol = hbm.getBlobCol().toUpperCase();
							String wherestr = getQuerySQLWhere(hbm, tableMetaMap
									.get(tableName).get("pkmap"));
							String sqlStr = "select " + blobCol + " from "
									+ hbm.getTableName() + " where " + blobCol
									+ " is not null and" + wherestr;

							if (jdbcTemplate == null)
								jdbcTemplate = new JdbcTemplate(
										Constant.DATASOURCE);
							if (conn == null)
								conn = jdbcTemplate.getDataSource()
										.getConnection();

							Statement stmt = conn.createStatement();
							ResultSet rs = stmt.executeQuery(sqlStr);

							if (rs.next()) {
								filename = SnUtil.getNewID();

								Blob _blob = rs.getBlob(blobCol);

								InputStream in = _blob.getBinaryStream();
								BufferedInputStream bis = new BufferedInputStream(
										in);

								ZipEntry ze = new ZipEntry(filename);
								zout.putNextEntry(ze);
								int len = 0;
								byte[] buf = new byte[bufferSize];
								while ((len = bis.read(buf, 0, bufferSize)) != -1) {
									zout.write(buf, 0, len);
								}

								bis.close();
								zout.closeEntry();

								updatesql = "update " + hbm.getTableName()
										+ " set "
										+ hbm.getBlobCol().toUpperCase()
										+ "=? where " + wherestr;
							}
							rs.close();
							stmt.close();
							updateSql.addAttribute("colType", "Blob");
						}

						String clobCol = hbm.getClobCol();
						if (clobCol != null && !clobCol.equals("")) {
							clobCol = clobCol.toUpperCase();
							String wherestr = getQuerySQLWhere(hbm, tableMetaMap
									.get(tableName).get("pkmap"));
							String sqlStr = "select " + clobCol + " from "
									+ hbm.getTableName() + " where " + clobCol
									+ " is not null and" + wherestr;
							if (jdbcTemplate == null)
								jdbcTemplate = new JdbcTemplate(
										Constant.DATASOURCE);
							if (conn == null)
								conn = jdbcTemplate.getDataSource()
										.getConnection();

							Statement stmt = conn.createStatement();
							ResultSet rs = stmt.executeQuery(sqlStr);

							if (rs.next()) {
								filename = SnUtil.getNewID();

								Reader reader = rs.getCharacterStream(clobCol);
								BufferedReader bufReader = new BufferedReader(
										reader);

								ZipEntry ze = new ZipEntry(filename);
								zout.putNextEntry(ze);
								OutputStreamWriter writer = new OutputStreamWriter(
										zout);
								BufferedWriter bwr = new BufferedWriter(writer);
								String line;
								while ((line = bufReader.readLine()) != null) {
									bwr.write(line);
								}

								bufReader.close();
								bwr.flush();
								zout.closeEntry();

								updatesql = "update " + hbm.getTableName()
										+ " set " + clobCol + "=? where "
										+ wherestr;
							}
							rs.close();
							stmt.close();
							updateSql.addAttribute("colType", "Clob");
						}

						updateSql.addCDATA(updatesql);
						fileName.addCDATA(filename);
					}// 结束事务中所有数据的循环
					if (logDetailMap != null) {
						logDetailMap.put(curTxGroup, detailList);
					}
				}// 结束所有事务的循环
			}
			String fname = SnUtil.getNewID().concat(".xml");

			SOAPElement el = body.addBodyElement(requestEnvelope.createName("data"));
			el.addTextNode(fname);

			// 格式化XML
			File tmp = new File(tempdir.concat(SnUtil.getNewID().concat(".xml")));
			allFileList.add(tmp);
			OutputFormat format = OutputFormat.createPrettyPrint();
			format.setEncoding("UTF-8");
			XMLWriter writer = new XMLWriter(new FileOutputStream(tmp), format);
			writer.write(doc);
			writer.close();

			// 向压缩文件中添加xml
			FileInputStream in = new FileInputStream(tmp);
			ZipEntry ze = new ZipEntry(fname);
			zout.putNextEntry(ze);
			int len = 0;
			byte[] buf = new byte[bufferSize];
			while ((len = in.read(buf, 0, bufferSize)) != -1) {
				zout.write(buf, 0, len);
			}
			zout.closeEntry();
			zout.close();
			in.close();

			DataSource ds = new FileDataSource(zip);
			DataHandler dh = new DataHandler(ds);
			AttachmentPart attachment = soapMessage.createAttachmentPart(dh);
			attachment.setContentId(zipName);
			soapMessage.addAttachmentPart(attachment);
			soapMessage.saveChanges();

		} catch (Exception e) {
			log.info("生成SoapMessage消息失败!!!");
			log.error(Constant.getTrace(e));
			e.printStackTrace();
		} finally {
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {
					log.error(Constant.getTrace(e));
					e.printStackTrace();
				}
			}
			if (zout != null) {
				try {
					zout.close();
				} catch (IOException e) {
					//e.printStackTrace();
				}
			}
			if (!debug) {
				for (File file : allFileList) {
					if (file.exists())
						file.delete();
				}
			}

		}
		return soapMessage;
	}

	/**
	 * 由给定的bean名称获取hibernate的映射
	 * 
	 * @param entityName
	 * @return
	 */
	public PersistentClass getPersistentClassByEntityName(String entityName) {
		if (this.hc == null)
			this.initHibernateConfiguration();
		return this.hc.getClassMapping(entityName);
	}

	/**
	 * 取得发送队列下一个序号
	 * 
	 * @param pid
	 *            接收端pid
	 * @return
	 */
	public long getNewExchangeXh(String pid) {
		List tempLst = baseDAO
				.getDataAutoCloseSes("select (nvl(max(t.xh),0)+1) xh from pc_data_exchange t where pid='"
						+ pid + "'");
		Long xh = ((java.math.BigDecimal) tempLst.iterator().next())
				.longValue();
		if(xh>99999) xh=0L;
		return xh;
	}

	/**
	 * 将列表中的数据交换对象保存到待发送队列中,若发送端的URL为空则不会加入到队列
	 * @param exchangeList    数据交换对象列表
	 * @return 1表示成功 0表示失败
	 * @即使没有远程地址也将数据加入到队列
	 */
	@SuppressWarnings("rawtypes")
	public String addExchangeListToQueue(List<PcDataExchange> exchangeList)
			throws PCDataExchangeException {
		try{
			if (!exchangeEnabled)	return "0";
			//Map<String, SgccIniUnit> sendUnitMap = new HashMap<String, SgccIniUnit>();
			for (PcDataExchange pcDataExchange : exchangeList) {
				/*String curPid = pcDataExchange.getPid();
				if (curPid == null || curPid.equals("")) {
					continue;
				}
				
				if (sendUnitMap.get(curPid) == null) {
					Object obj = baseDAO.findBeanByProperty(SgccIniUnit.class.getName(), "unitid", curPid);
					if (obj == null) continue;
					sendUnitMap.put(curPid, (SgccIniUnit) obj);
				}
				SgccIniUnit curSendUnit = sendUnitMap.get(curPid);
				// 如果发送端的URL为空直接跳过
				if (curSendUnit.getAppUrl() == null	|| curSendUnit.getAppUrl().equals("")) {
					continue;
				}*/
				// 判断数据是否已经存在于报送队列
				List lt = baseDAO.findByWhere(PcDataExchange.class.getName(),
						"tableName='" + pcDataExchange.getTableName()
						+ "' and keyValue='" + pcDataExchange.getKeyValue()
						+ "' and pid = '" + pcDataExchange.getPid() + "' and sqlData is null");
				if (lt.size() > 0) {
					baseDAO.deleteAll(lt);
				}
				// 设置加入队列时间
				pcDataExchange.setSpareD2(new Date());
				baseDAO.insert(pcDataExchange);
			}
		}catch (PCDataExchangeException ex) {
			log.error(Constant.getTrace(ex));
			ex.printStackTrace();
			return "0";
		}
		return "1";
	}
	/**
	 * 将待发送的数据添加到队列，List中存放业务数据的bean（必须有hibernate映射）
	 * @param list       bean列表
	 * @param pid        发送到的PID
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public List<PcDataExchange> getExchangeDataList(List list, String pid) {
		return getExchangeDataList(list, pid, null, null, null);
	}
	@SuppressWarnings("rawtypes")
	public List<PcDataExchange> getExchangeDataList(List list, String pid,
			String bizInfo) {
		return getExchangeDataList(list, pid, null, null, bizInfo);
	}
	/**
	 * 将待发送的数据添加到队列，List中存放业务数据的bean（必须有hibernate映射）
	 * @param list          bean列表
	 * @param pid           发送到的PID
	 * @param sqlBefore     前置SQL
	 * @param sqlAfter      后置SQL
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public List<PcDataExchange> getExchangeDataList(List list, String pid,
			String sqlBefore, String sqlAfter) {
		return getExchangeDataList(list, pid, sqlBefore, sqlAfter, null);
	}
	@SuppressWarnings("rawtypes")
	public List<PcDataExchange> getExchangeDataList(List list, String pid,
			String sqlBefore, String sqlAfter, String bizInfo) {
			return getExcDataList(list, pid, null, sqlBefore, sqlAfter, bizInfo);
	}
	/**
	 * 将待发送的数据转换成数据交互对象列表，List中存放业务数据的bean（必须有hibernate映射）
	 * @param list
	 * @param pid 接收单位
	 * @param sendUnit 发送单位
	 * @param sqlBefore
	 * @param sqlAfter
	 * @param bizInfo
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public List<PcDataExchange> getExcDataList(List list, String pid, String sendUnit,
			String sqlBefore, String sqlAfter, String bizInfo){
		List<PcDataExchange> returnList = new ArrayList<PcDataExchange>();
		Long xh = getNewExchangeXh(pid);
		Map<String, PersistentClass> pcMap = new HashMap<String, PersistentClass>();
		Map<String, Map<String, List>> tableMetaMap = new HashMap<String, Map<String,List>>();
		
		String txGroup = SnUtil.getNewID("tx-");
		for (int i = 0, j = list.size(); i < j; i++) {
			Object obj = list.get(i);
			String className = obj.getClass().getName();
			if ( pcMap.get(className)==null ){
				PersistentClass pc = getPersistentClassByEntityName(className);
				if ( pc == null ){
					throw new PCDataExchangeException(className + "找不到对应的映射文件");
				}
				pcMap.put(className, pc);
			}
			PersistentClass curPc = pcMap.get(className);
			String tableName = curPc.getTable().getName().toUpperCase();
			if ( tableMetaMap.get(tableName) == null ){
				Map<String, List> lobMetaMap = getLobMetaMap(tableName);
				
				tableMetaMap.put(tableName, lobMetaMap);
			}
			Map<String, List> curMetaMap = tableMetaMap.get(tableName);
			PcDataExchange hbm = this.converBean(obj,pid, txGroup, xh++,curPc, curMetaMap);
			// 将前置sql，后置sql加入到第一个pcDataExchange数据中
			if (i == 0) {
				hbm.setSpareC1(sqlBefore);
				hbm.setSpareC2(sqlAfter);
			}
			hbm.setBizInfo(bizInfo);
			hbm.setSpareC5(sendUnit);//发送单位
			returnList.add(hbm);
		}
		return returnList;
	}
	/**
	 * 根据返回的SOAPMessage标记发送队列的状态，如果SOAPMessage对象为空，直接标记所有数据传输失败
	 * @param list
	 * @param retMessage
	 */
	@SuppressWarnings("rawtypes")
	private boolean setExchangedDataStatus(List<List<PcDataExchange>> list,
			Map<String, List<PcDataExchangeLogDetail>> logDetailMap,
			SOAPMessage retMessage) {
		boolean retVal = true;
		try {
			Session ses = HibernateSessionFactory.getSession();
			Transaction tx = ses.beginTransaction();
			if (retMessage == null) {
				SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
				String opDate = sdf.format(new Date());
				for (List<PcDataExchange> dataList : list) {
					String curTxGroup = dataList.get(0).getTxGroup();
					String curPid = dataList.get(0).getPid();
					
					// 业务描述
					String bizInfo = dataList.get(0).getBizInfo();
					String sql = "update pc_data_exchange t set success_flag='-2',spare_d1 = to_date('%s', 'yyyymmddhh24miss'), " +
							"spare_n1 = nvl2(spare_n1, spare_n1 + 1, 1 ) where tx_group = '%s'";
					sql = String.format(sql, opDate, curTxGroup);

					ses.createSQLQuery(sql).executeUpdate();
					
					String exceptionMsg = "连接失败，请检查URL地址设置以及接受端程序是否启动";
					if (bizInfo != null) {
						exceptionMsg += " 交互数据内容：" + bizInfo;
					}
					retVal = false;
					// 创建日志对象
					String fromunit = (dataList.get(0).getSpareC5())==null||(dataList.get(0).getSpareC5()).equals("")?
							"未知":dataList.get(0).getSpareC5();
					
					PcDataExchangeLog exchangeLog = new PcDataExchangeLog();
					exchangeLog.setLogType("send");
					exchangeLog.setTxGroupId(curTxGroup);
					exchangeLog.setLogDate(new Date());
					exchangeLog.setLogContent(exceptionMsg);
					exchangeLog.setPid(curPid);
					exchangeLog.setSpareN1(0);//执行失败
					exchangeLog.setFromunit(fromunit);
					exchangeLog.setTounit(curPid);
					
					ses.save(exchangeLog);
				}

				ses.flush();
				tx.commit();
				ses.close();
				return retVal;
			}

			// 解析SOAPMessage,将每一条<tx></tx>记录以tx_group编号为key存放在map中
			Map<String, SOAPElement> resultMap = new HashMap<String, SOAPElement>();

			SOAPBody body = retMessage.getSOAPBody();
			Iterator iterator = body.getChildElements(); // 得到result标签内容
			if (iterator.hasNext()) {
				SOAPElement resultElement = (SOAPElement) iterator.next();
				Iterator txIterator = resultElement.getChildElements();
				while (txIterator.hasNext()) {
					SOAPElement txElement = (SOAPElement) txIterator.next();
					String key = txElement.getAttribute("id");
					resultMap.put(key, txElement);
				}
			}

			for (List<PcDataExchange> dataList : list) {
				// 得到当前list中的tx_group编号对应的返回值
				PcDataExchange firstExchange = dataList.get(0);
				String curTxGroup = firstExchange.getTxGroup();
				String curPid = firstExchange.getPid();
				String bizInfo = firstExchange.getBizInfo();
				String sqlBefore = firstExchange.getSpareC1();
				String sqlAfter = firstExchange.getSpareC2();
				String fromunit = firstExchange.getSpareC5()==null||firstExchange.getSpareC5().equals("")?"未知":firstExchange.getSpareC5();
				String tounit = firstExchange.getPid();
				
				SOAPElement curResult = resultMap.get(curTxGroup);
				if (curResult != null) {
					String success = curResult.getAttribute("success");
					String opDate = curResult.getAttribute("opDate");
					String sql;
					String message = curResult.getTextContent();
					int ifSuccess = 0;
					if (success.equals("1")) {
						// "update pc_data_exchange t set success_flag='1',success_date = to_date('%s', 'yyyymmddhh24miss') where tx_group = '%s'";
						// 成功后直接删除
						sql = "delete from pc_data_exchange t where tx_group = '%s'";
						sql = String.format(sql, curTxGroup);
						message = "发送成功!";
						ifSuccess = 1;
					} else {
						// 失败后将状态标记为-1
						sql = "update pc_data_exchange t set success_flag='-1',spare_d1 = to_date('%s', 'yyyymmddhh24miss'), spare_n1 = nvl2(spare_n1, spare_n1 + 1, 1 ) where tx_group = '%s'";
						sql = String.format(sql, opDate, curTxGroup);
						retVal = false;
					}
					ses.createSQLQuery(sql).executeUpdate();
					// 创建日志对象
					PcDataExchangeLog exchangeLog = new PcDataExchangeLog();
					exchangeLog.setLogType("send");
					exchangeLog.setTxGroupId(curTxGroup);
					exchangeLog.setLogDate(new Date());
					exchangeLog.setLogContent((bizInfo != null)?(message+" 交互数据内容：" + bizInfo):message);
					exchangeLog.setPid(curPid);
					exchangeLog.setSpareN1(ifSuccess);
					exchangeLog.setSpareC1(sqlBefore);//前置后置语句
					exchangeLog.setSpareC2(sqlAfter);
					exchangeLog.setFromunit(fromunit);
					exchangeLog.setTounit(tounit);
					
					String logId = ses.save(exchangeLog).toString();
					List<PcDataExchangeLogDetail> detailList = logDetailMap.get(curTxGroup);
					if (detailList != null) {
						for (PcDataExchangeLogDetail detail : detailList) {
							detail.setLogId(logId);
							ses.save(detail);
						}
					}
				}
			}
			
			ses.flush();
			tx.commit();
			ses.close();
			
			return retVal;
		} catch (Exception e) {
			log.error(Constant.getTrace(e));
			e.printStackTrace();
			return retVal;
		}
	}

	/**
	 * 取得待发送队列中的消息进行发送，不发送当天已经失败的数据
	 * @param recPerTrans 每条SOAPMessage中的记录数量
	 * @return 若还有数据交换则返回真，已没有交换数据则返回假
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private boolean sendData(int recPerTrans) {
		boolean retVal = true;
		// 当前的年月日
		DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
		String todayStr = dateFormat.format(new Date());
		
		Session ses = HibernateSessionFactory.getSession();
		// 未成功且本日还没有发送过的记录()
		String txsSql = "select distinct tx_group from (select tx_group from (select t.tx_group  " +
				" from pc_data_exchange t  where success_Flag <> 1 and (to_char(spare_D1,'yyyymmdd') <='"
				+ todayStr	+ "' or spare_D1 is null) and nvl(spare_N1,0) < "	+ retryLimit+
				" order by t.tx_group,t.pid asc)" +
				" where rownum<="+recPerTrans+") order by tx_group asc";
		
		log.info("【任务调动】事务查询SQL:"+txsSql);
		
		List<String> txLt  = ses.createSQLQuery(txsSql).list();
		if(txLt.size()==0) return false;
		List preExcLt = new ArrayList();
		
		String toUnit = "";//接收单位
		String fromUnit = "";//发送单位
		
		for(int i=0;i<txLt.size();i++){
			String txSql = "select * from pc_data_exchange where tx_Group='"+txLt.get(i)+"' order by xh asc";
			List<PcDataExchange> extraList = ses.createSQLQuery(txSql).addEntity(PcDataExchange.class).list();
			if(extraList.size()>0){
				if(i==0){
					toUnit = extraList.get(0).getPid();
					fromUnit = extraList.get(0).getSpareC5();
					preExcLt.add(extraList);
				}else{
					if((extraList.get(0).getPid()).equals(toUnit)){
						preExcLt.add(extraList);
					}
				} 
			}
		}
		// 用于接收详细日志的Map
		Map<String, List<PcDataExchangeLogDetail>> logDetailMap = new HashMap<String, List<PcDataExchangeLogDetail>>();
		try {
			log.info("任务调度：【"+(fromUnit==null?"":fromUnit)+"】开始生成SOAPMessage消息......");
			SOAPMessage soapMessage = getMsgMessage(preExcLt, logDetailMap);
			log.info("任务调度：【"+(fromUnit==null?"":fromUnit)+"】成功生成SOAPMessage消息......");
			
			SgccIniUnit unit = (SgccIniUnit) baseDAO.findByProperty(SgccIniUnit.class.getName(), "unitid", toUnit).get(0);
			
			URLEndpoint destination = new URLEndpoint(makeReceiverServletUrl(unit.getAppUrl()));
			
			log.info("任务调度：【"+(fromUnit==null?"":fromUnit)+"】远程调用，发送SOAPMessage消息......");
			SOAPMessage returnMsg = getSOAPConnection().call(soapMessage, destination);
			log.info("任务调度：【"+(fromUnit==null?"":fromUnit)+"】远程返回，接收到SOAPMessage消息......");
			
			setExchangedDataStatus(preExcLt, logDetailMap, returnMsg);
		} catch (Exception e) {
			setExchangedDataStatus(preExcLt, logDetailMap, null);
			log.error(Constant.getTrace(e));
			e.printStackTrace();
		}

		return retVal;
	}
	/**
	 * 发送选定的事务组数据
	 * @param txIds选的的事务组
	 */
	@SuppressWarnings("unchecked")
	public String sendExchangeDataByTxId(String[] txIds) {
		boolean isHaveData= false;//根据给定的事物编号组，查询是否含待发送的数据，如果没有则视为发送失败
		String failTx= "";
		if (!exchangeEnabled) {
			log.info("手动发送数据失败：数据交互开关未打开！");
			return "数据交互开关未打开！";
		}
		for (String txId : txIds) {
			List<PcDataExchange> txList = baseDAO.findByWhere(
					PcDataExchange.class.getName(), "tx_Group='" + txId
							+ "' and SUCCESS_FLAG<>'1' order by XH asc");
			String curPid = txList.get(0).getPid();
			String fromUnit = txList.get(0).getSpareC5();
			List<List<PcDataExchange>> list = new ArrayList<List<PcDataExchange>>();
			list.add(txList);
			if (list.size() > 0) {
				isHaveData = true;//包含待发送的数据
				Map<String, List<PcDataExchangeLogDetail>> logDetailMap = new HashMap<String, List<PcDataExchangeLogDetail>>();
				try {
					
					log.info("【"+(fromUnit==null?"":fromUnit)+"】开始生成SOAPMessage消息......");
					SOAPMessage soapMessage = getMsgMessage(list, logDetailMap);
					log.info("【"+(fromUnit==null?"":fromUnit)+"】成功生成SOAPMessage消息......");

					// 获得当前pid单位的app地址
					SgccIniUnit unit = (SgccIniUnit) baseDAO.findByProperty(SgccIniUnit.class.getName(), "unitid", curPid).get(0);
					URLEndpoint destination = new URLEndpoint(makeReceiverServletUrl(unit.getAppUrl()));
					
					log.info("【"+(fromUnit==null?"":fromUnit)+"】远程调用，发送SOAPMessage消息......");
					SOAPMessage returnMsg = getSOAPConnection().call(soapMessage, destination);
					log.info("【"+(fromUnit==null?"":fromUnit)+"】远程返回，接收到SOAPMessage消息......");
					try {
						returnMsg.writeTo(System.out);
					} catch (IOException e) {
						log.error(Constant.getTrace(e));
						e.printStackTrace();
					}
					boolean flag = setExchangedDataStatus(list, logDetailMap, returnMsg);
					if(!flag) failTx += "、"+txId;
				} catch (SOAPException e) {
					setExchangedDataStatus(list, logDetailMap, null);
					log.info("事务编号为【"+txId+"】的数据发送失败："+e.getMessage());
					log.error(Constant.getTrace(e));
					e.printStackTrace();
					failTx += ","+txId;
				}
			}
		}
		if(failTx.length()>1){
			failTx = "事务编号为："+failTx.substring(1)+"的数据发送失败";
			return failTx;
		}else if(!isHaveData){//在数据中没有找到数据
			log.info("手动发送数据失败：数据库中没有找到给定事务编号的待报送数据!");
			return "发送失败！";
		}else{
			return "1";
		}
	}
	/**
	 * 发送列表中的数据，需要保证列表中数据的Pid，txGroup都相同
	 * 
	 * @param exchangeList
	 *            交换的数据列表
	 */
	@SuppressWarnings("rawtypes")
	public Map<String, String> sendExchangeData(
			List<PcDataExchange> exchangeList) {
		Map<String, String> returnMap = new HashMap<String, String>();
		String result = "success";
		String status = "";
		String message = "";
		String exception = "";

		// 如果没有打开数据交换开关直接设置为成功
		if (!exchangeEnabled) {
			status = "exchange_disabled";
			message = "系统没有打开数据交换功能";
			returnMap.put("result", result);
			returnMap.put("status", status);
			returnMap.put("message", message);
			log.info("数据交互开关未打开！");
			return returnMap;
		}

		PcDataExchange firstExchange = exchangeList.get(0);
		String curPid = firstExchange.getPid();
		String curTxGroup = firstExchange.getTxGroup();
		String bizInfo = firstExchange.getBizInfo();
		String sqlBefore = firstExchange.getSpareC1();
		String sqlAfter = firstExchange.getSpareC2();
		String fromunit = firstExchange.getSpareC5()==null||firstExchange.getSpareC5().equals("")?"未知":firstExchange.getSpareC5();
		String tounit = firstExchange.getPid();

		returnMap.put("curTxGroup", curTxGroup);
		// 获得当前pid单位的app地址
		SgccIniUnit unit = (SgccIniUnit) baseDAO.findByProperty(SgccIniUnit.class.getName(), "unitid", curPid).get(0);
		String url = makeReceiverServletUrl(unit.getAppUrl());
		if (url == null || url.equals("")) {
			status = "url_empty";
			message = "接受端URL为空";
			returnMap.put("result", "fail");
			returnMap.put("status", status);
			returnMap.put("message", message);
			log.info("接受端URL为空");
			return returnMap;
		}

		List<List<PcDataExchange>> list = new ArrayList<List<PcDataExchange>>();
		list.add(exchangeList);
		Map<String, List<PcDataExchangeLogDetail>> logDetailMap = new HashMap<String, List<PcDataExchangeLogDetail>>();
		
		SOAPMessage returnMsg = null;
		Session ses = HibernateSessionFactory.getSession();
		Transaction tx = ses.beginTransaction();
		
		try {
			log.info("【"+(fromunit==null?"":fromunit)+"】开始生成SOAPMessage消息......");
			SOAPMessage soapMessage = getMsgMessage(list, logDetailMap);
			log.info("【"+(fromunit==null?"":fromunit)+"】成功生成SOAPMessage消息......");
			
			URLEndpoint destination = new URLEndpoint(url);
			
			log.info("【"+(fromunit==null?"":fromunit)+"】远程调用，发送SOAPMessage消息......");
			returnMsg = getSOAPConnection().call(soapMessage, destination);
			log.info("【"+(fromunit==null?"":fromunit)+"】远程返回，接收到SOAPMessage消息......");
			
			returnMsg.writeTo(System.out);
		} catch (SOAPException e) {
			String exceptionMsg = "实时交互：连接失败，请检查URL地址设置以及接受端程序是否启动。";

			e.printStackTrace();
			log.info(exceptionMsg);
			log.error(Constant.getTrace(e));
			if (bizInfo != null) {
				exceptionMsg += " 交互数据内容：" + bizInfo;
			}
			// 创建日志对象
			PcDataExchangeLog exchangeLog = new PcDataExchangeLog();
			exchangeLog.setLogType("send");
			exchangeLog.setTxGroupId(curTxGroup);
			exchangeLog.setLogDate(new Date());
			exchangeLog.setLogContent(exceptionMsg);
			exchangeLog.setPid(curPid);
			exchangeLog.setFromunit(fromunit);
			exchangeLog.setTounit(tounit);
			exchangeLog.setSpareN1(0);
			
			ses.save(exchangeLog);
			tx.commit();
			ses.close();
			
			result = "fail";
			status = "connection_failure";
			message = "连接失败，请检查URL地址设置以及接受端程序是否启动。";
			exception = e.getMessage();
			returnMap.put("result", result);
			returnMap.put("status", status);
			returnMap.put("message", message);
			returnMap.put("exception", exception);

			return returnMap;

		} catch (IOException ex) {
			ex.printStackTrace();
			log.error(Constant.getTrace(ex));
			
			result = "fail";
			status = "connection_failure";
			message = "处理返回消息时发生错误。";
			exception = ex.getMessage();
			returnMap.put("result", result);
			returnMap.put("status", status);
			returnMap.put("message", message);
			returnMap.put("exception", exception);
		}
		SOAPBody body = null;
		try {
			body = returnMsg.getSOAPBody();
		} catch (SOAPException e) {
			e.printStackTrace();
			log.error(Constant.getTrace(e));
		}

		Iterator iterator = body.getChildElements(); // 得到result标签内容
		result = "fail";
		status = "remote_error";
		message = "返回消息格式错误。";
		if (iterator.hasNext()) {
			SOAPElement resultElement = (SOAPElement) iterator.next();
			Iterator txIterator = resultElement.getChildElements();
			if (txIterator.hasNext()) {
				SOAPElement txElement = (SOAPElement) txIterator.next();
				String success = txElement.getAttribute("success");
				exception = txElement.getTextContent();

				String exceptionMsg = exception;

				// 创建日志对象
				PcDataExchangeLog exchangeLog = new PcDataExchangeLog();
				exchangeLog.setLogType("send");
				exchangeLog.setTxGroupId(curTxGroup);
				exchangeLog.setLogDate(new Date());
				exchangeLog.setPid(curPid);
				exchangeLog.setSpareC1(sqlBefore);
				exchangeLog.setSpareC2(sqlAfter);
				exchangeLog.setFromunit(fromunit);
				exchangeLog.setTounit(tounit);
				
				if (!success.equals("1")) {
					result = "fail";
					status = "sql_error";
					message = "接收端执行数据交互时发生错误";
					exchangeLog.setSpareN1(0);

					returnMap.put("exception", exception);
				} else {
					exceptionMsg = "数据交互成功！";
					result = "success";
					status = "excecuted";
					message = "数据交互成功";
					
					exchangeLog.setSpareN1(1);
				}
				if (bizInfo != null) {
					exceptionMsg += " 交互数据内容：" + bizInfo;
				}
				exchangeLog.setLogContent("实时交互：" + exceptionMsg);

				String logId = ses.save(exchangeLog).toString();
				
				// 详细日志
				List<PcDataExchangeLogDetail> detailList = logDetailMap.get(curTxGroup);
				if (detailList != null) {
					for (PcDataExchangeLogDetail detail : detailList) {
						detail.setLogId(logId);
						ses.save(detail);
					}
				}
			}
		}
		tx.commit();
		ses.close();
		
		returnMap.put("result", result);
		returnMap.put("status", status);
		returnMap.put("message", message);
		return returnMap;

	}

	/**
	 * 发送队列中所有数据，当天已发送失败过的数据不会重复发送
	 * 队列中的数据以tx_group分组，然后按照xh排序，发送recPerTrans参数规定的条数
	 * 
	 * @return
	 */
	public boolean sendAllQueuedExchangeData() {
		log.info("【任务调度】开始数据发送!!!");
		if (exchangeEnabled) {
			while (sendData(recPerTrans)) {}
		}else{
			log.info("数据交互开关未打开!!!");
		}
		log.info("【任务调度】结束数据发送!!!");
		return true;
	}
	/**
	 * 附件和大对象(SGCC_ATTACH_LIST和SGCC_ATTACH_BLOB)进行交换
	 * @param fileLshArr 文件流水号数组(对应两个表中的FILE_LSH字段)
	 * @param receiveUnit 接收端PID
	 * @param sendUnit 发送端PID
	 * @param bizInfo 业务说明
	 * @param immediate 为真则立即发送，否则加入到发送队列
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public boolean exchangeAttachments(String[] fileLshArr, String receiveUnit, String sendUnit, String bizInfo, boolean immediate) {
		boolean retVal = true;
		//如果开关关闭直接返回
		if (! exchangeEnabled ){
			log.info("数据交互功能开关未打开!");
			return false;
		}
		//事物编号
		String curTxGroup = SnUtil.getNewID("tx-");
		// 当前序号
		long curXh = getNewExchangeXh(receiveUnit);
		List<PcDataExchange> exchangeList = new ArrayList<PcDataExchange>();
		Map<String, List> attListMetaMap = getLobMetaMap("SGCC_ATTACH_LIST");
		PersistentClass attachListPc = getPersistentClassByEntityName(SgccAttachList.class.getName());
		
		try {
			for (String lsh : fileLshArr) {
				//找到当前AttachList
				SgccAttachList attach = (SgccAttachList) baseDAO.findBeanByProperty(SgccAttachList.class.getName(),"id.fileLsh", lsh);
				if (attach == null) { // 删除
					List<PcDataExchange> excList = baseDAO.findByWhere(PcDataExchange.class
							.getName(), "table_name = 'SGCC_ATTACH_LIST' and key_value like '[{\"FILE_LSH\":\""
							+ lsh + "\"%' and pid = '" + receiveUnit + "'");
					if (excList.size() > 0 && !immediate) {
						PcDataExchange curEx = excList.get(0);
						//复制成一个新对象，否则可能出现Hibernate不进行更新的情况
						PcDataExchange attachEx = new PcDataExchange(receiveUnit,curEx.getTableName(), curEx.getKeyValue(), "0");
						attachEx.setBizInfo(bizInfo);//业务说明
						attachEx.setSpareC5(sendUnit);//发送单位
						attachEx.setXh(curXh++);
						attachEx.setTxGroup(curTxGroup);

						exchangeList.add(attachEx);
					} else {
						JSONArray kvarr = new JSONArray();
						JSONObject kv = new JSONObject();
						kv.put("FILE_LSH", lsh);
						kvarr.add(kv);
						
						PcDataExchange attachEx = new PcDataExchange();
						attachEx.setTableName("SGCC_ATTACH_LIST");
						attachEx.setKeyValue(kvarr.toString());
						attachEx.setSuccessFlag("0");
						attachEx.setSqlData("DELETE FROM SGCC_ATTACH_LIST WHERE FILE_LSH = '"+ lsh + "'");
						attachEx.setXh(curXh++);
						attachEx.setPid(receiveUnit);
						attachEx.setSpareC5(sendUnit);//发送单位
						attachEx.setBizInfo(bizInfo);//业务说明
						attachEx.setTxGroup(curTxGroup);

						exchangeList.add(attachEx);
					}
				} else {
					PcDataExchange attachEx = converBean(attach,receiveUnit, curTxGroup,curXh++, attachListPc, attListMetaMap);
					attachEx.setSpareC5(sendUnit);//发送单位
					attachEx.setBizInfo(bizInfo);//业务说明
					exchangeList.add(attachEx);
				}
				JSONArray kvarr = new JSONArray();
				JSONObject kv = new JSONObject();
				kv.put("FILE_LSH", lsh);
				kvarr.add(kv);
				
				PcDataExchange exchange = new PcDataExchange();
				exchange.setTableName("SGCC_ATTACH_BLOB");
				exchange.setBlobCol("FILE_NR");
				exchange.setKeyValue(kvarr.toString());
				exchange.setSuccessFlag("0");
				exchange.setXh(curXh++);
				exchange.setPid(receiveUnit);
				exchange.setTxGroup(curTxGroup);
				exchange.setSpareC5(sendUnit);//发送单位
				exchange.setBizInfo(bizInfo);//业务说明
				
				exchangeList.add(exchange);
			}

			if (immediate) {
				// 立即发送
				Map rtnMap = sendExchangeData(exchangeList);
				if(rtnMap.get("result").equals("success")){
					retVal = true;
				}else{
					retVal = false;
				}
			} else {
				// 加入队列定时发送
				addExchangeListToQueue(exchangeList);
			}
		} catch (Exception e) {
			e.printStackTrace();
			log.error(Constant.getTrace(e));
			return false;
		}
		return retVal;
	}

	private String makeReceiverServletUrl(String appUrl) {
		String retUrl = appUrl;
		if (appUrl != null && appUrl.indexOf(servletName) == -1) {

			if (!appUrl.substring(appUrl.length() - 1).equals("/")) {
				retUrl += "/";
			}
			retUrl += servletName;
		}
		return retUrl;
	}

	private Map<String, Map<String, String>> getTableMetaMap(String tableName) {
		Map<String, Map<String, String>> retMap = new HashMap<String, Map<String, String>>();
		// 主键信息<字段名称,数据类型>
		Map<String, String> pkmap = getPrimaryKeyByTableName(tableName);
		retMap.put("pkmap", pkmap);
		// 唯一约束信息<字段名称,数据类型>
		Map<String, String> ukmap = getUniqueKeyByTableName(tableName);
		retMap.put("ukmap", ukmap);
		// 列信息<字段名称,数据类型>
		Map<String, String> colmap = getColumnsByTableName(tableName);
		retMap.put("colmap", colmap);
		return retMap;
	}
	
	@SuppressWarnings("rawtypes")
	private Map<String, List> getLobMetaMap(String tableName){
		Map<String, List> metaMap = new HashMap<String, List>();
		List blobList = baseDAO.findByWhere(VPcUserTabCols.class.getName(),
				"table_name='" + tableName + "' AND DATA_TYPE='BLOB'");
	
		List clobList = baseDAO.findByWhere(VPcUserTabCols.class.getName(),
				"table_name='" + tableName + "' AND DATA_TYPE in ('CLOB', 'LONG')");
		metaMap.put("blob", blobList);
		metaMap.put("clob", clobList);
		return metaMap;
	}
	/**
	 * 将待发送的数据转换成数据交互对象列,bean（必须有hibernate映射）
	 * @param list
	 * @param pid 接收单位
	 * @param sendUnit 发送单位
	 * @param sqlBefore
	 * @param sqlAfter
	 * @param bizInfo
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public PcDataExchange getExcData(Object obj, String pid, String sendUnit,
			String sqlBefore, String sqlAfter, String bizInfo) {
		Long xh = getNewExchangeXh(pid);
		Map<String, PersistentClass> pcMap = new HashMap<String, PersistentClass>();
		Map<String, Map<String, List>> tableMetaMap = new HashMap<String, Map<String,List>>();
		
		String className = obj.getClass().getName();
		if ( pcMap.get(className)==null ){
			PersistentClass pc = getPersistentClassByEntityName(className);
			if ( pc == null ){
				PCDataExchangeException ex = new PCDataExchangeException(className + "找不到对应的映射文件");
				log.error(Constant.getTrace(ex));
				throw ex;
			}
			pcMap.put(className, pc);
		}
		PersistentClass curPc = pcMap.get(className);
		String tableName = curPc.getTable().getName().toUpperCase();
		if ( tableMetaMap.get(tableName) == null ){
			Map<String, List> lobMetaMap = getLobMetaMap(tableName);
			
			tableMetaMap.put(tableName, lobMetaMap);
		}
		Map<String, List> curMetaMap = tableMetaMap.get(tableName);
		PcDataExchange hbm = this.converBean(obj,pid, SnUtil.getNewID("tx-"), xh++,curPc, curMetaMap);
		hbm.setSpareC1(sqlBefore);
		hbm.setSpareC2(sqlAfter);
		hbm.setBizInfo(bizInfo);
		hbm.setSpareC5(sendUnit);//发送单位
		
		return hbm;
	}
	/**
	 * 发送指定的数据
	 * @param excHbm 
	 * @param afterSql 数据交互成功后在发送端执行的sql语句数组
	 * @return
	 */
	public boolean sendExcData(PcDataExchange excHbm, String[] afterSql) {
		boolean flag = true;
		try{
			if(excHbm==null) return false;
			if(excHbm.getTxGroup()==null) excHbm.setTxGroup(SnUtil.getNewID("tx-"));
			if(excHbm.getXh()==null) excHbm.setXh(1L);
			if(excHbm.getTableName()==null) excHbm.setTableName("dual");
			
			if(baseDAO.findByWhere(SgccIniUnit.class.getName(), 
					"unitid='"+excHbm.getPid()+"' and app_url is not null").size()>0){
				List<PcDataExchange> lt = new ArrayList<PcDataExchange>();
				lt.add(excHbm);
				Map<String, String> rtnMap = this.sendExchangeData(lt);
				if(rtnMap.get("result").equals("success")){
					if(afterSql.length>0){
						Connection conn = HibernateSessionFactory.getConnection();
						conn.setAutoCommit(false);
						Statement  stmt = conn.createStatement();
						for(String sql : afterSql){
							stmt.addBatch(sql);
						}
						stmt.executeBatch();
						conn.commit();
						stmt.close();
						conn.close();
					}
				}else{
					flag = false;
				}
			}else{
				if(afterSql.length>0){
					Connection conn = HibernateSessionFactory.getConnection();
					conn.setAutoCommit(false);
					Statement  stmt = conn.createStatement();
					for(String sql : afterSql){
						stmt.addBatch(sql);
					}
					stmt.executeBatch();
					conn.commit();
					stmt.close();
					conn.close();
				}
			}
		}catch(Exception ex){
			ex.printStackTrace();
			flag = false;
		}
		return flag;
	}
}

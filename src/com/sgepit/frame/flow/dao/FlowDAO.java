package com.sgepit.frame.flow.dao;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCallback;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.BaseDAO;


public class FlowDAO extends BaseDAO
{

    protected void initDao()
    {
        super.initDao();
    }

    public static FlowDAO getFromApplicationContext(ApplicationContext ctx)
    {
        return (FlowDAO)ctx.getBean("flowDAO");
    }

    public synchronized void saveFileToBlob(final String fileid, final InputStream is, final int size, boolean isNew)
        throws SQLException, IOException
    {
        if(jdbcTemplate == null)
            jdbcTemplate = new JdbcTemplate(Constant.DATASOURCE);
        if(isNew)
        	jdbcTemplate.execute("insert into APP_BLOB (FILEID, BLOB, DATETIME) values (?, ?, sysdate)", new PreparedStatementCallback() {

                public Object doInPreparedStatement(PreparedStatement pstmt)
                    throws SQLException, DataAccessException
                {
                    pstmt.setString(1, fileid);
                    pstmt.setBinaryStream(2, is, size);
                    pstmt.execute();
                    return null;
                }
            });
        else
            jdbcTemplate.execute("update APP_BLOB set BLOB = ? where FILEID = ?", new PreparedStatementCallback() {

                public Object doInPreparedStatement(PreparedStatement pstmt)
                    throws SQLException, DataAccessException
                {
                    pstmt.setString(2, fileid);
                    pstmt.setBinaryStream(1, is, size);
                    pstmt.execute();
                    return null;
                }
            });
        is.close();
    }

    public InputStream getFileBlob(String fileid)
        throws SQLException
    {
    	if(jdbcTemplate == null)
            jdbcTemplate = new JdbcTemplate(Constant.DATASOURCE);
        InputStream is = null;
        String sql = (new StringBuilder("select BLOB from APP_BLOB where fileid = '")).append(fileid).append("'").toString();
        Connection conn = null;
        if(conn == null)
            conn = jdbcTemplate.getDataSource().getConnection();
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery(sql);
        Blob blob = null;
        if(rs.next())
        {
            blob = rs.getBlob("BLOB");
            is = blob.getBinaryStream();
        }
        rs.close();
        stmt.close();
        conn.close();
        return is;
    }

    public void deleteFileInBlob(String fileid)
    {
        if(jdbcTemplate == null)
            jdbcTemplate = new JdbcTemplate(Constant.DATASOURCE);
        String sql = (new StringBuilder("delete APP_BLOB where fileid='")).append(fileid).append("'").toString();
        jdbcTemplate.execute(sql);
    }

    private static final Log log = LogFactory.getLog(FlowDAO.class);
    private JdbcTemplate jdbcTemplate;

    /**
     * 插入方法，flush 方法会强制进行从内存到数据库的同步
     * @param transientInstance 要存入的对象
     * @return 主键
     * @author pengy 2013-11-1
     */
    public String insert(Object transientInstance)
    {
    	log.debug("insert " + transientInstance.getClass().getName());
    	String id = null;
    	try {
    		id = getHibernateTemplate().save(transientInstance).toString();
    		//flush 方法会强制进行从内存到数据库的同步
    		getHibernateTemplate().flush();
    		log.debug("insert successful");
    	} catch (RuntimeException re) {
    		log.error("insert failed", re);
    		throw re;
    	}
    	return id;
	}
}

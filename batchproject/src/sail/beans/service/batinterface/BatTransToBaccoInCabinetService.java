package sail.beans.service.batinterface;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import sail.beans.Constants;
import sail.beans.dao.GenericDao;
import sail.beans.entity.BatWorkOrder;
import sail.beans.entity.BatWorkOrderOutput;
import sail.beans.entity.UBatTransToBaccoInCabinet;
import sail.beans.support.DateBean;
import sail.beans.support.StingUtil;

@Service
public class BatTransToBaccoInCabinetService extends CommonService{
	@Autowired
	private GenericDao genericDao;  
	
	/**
	 * 获取待转储并新增生产工单投料后台服务（成品烟丝进柜）
	 * @return
	 */
	public void SaveBatTransToBaccoInCabinet(){
		try{
			List<UBatTransToBaccoInCabinet> mainList = genericDao.getListWithVariableParas("SYNCHRO.U_BAT_TRANSTOBACCOINTOCABINET.LIST", new Object[]{});
			UBatTransToBaccoInCabinet order = null;
			BatWorkOrderOutput output = null;
			if (mainList != null && mainList.size() > 0){
				for(int i=0;i<mainList.size();i++){
					String matBatch = mainList.get(i).getMatBatch().toString()+Constants.ZP03;
					BatWorkOrder batWorkOrder = this.getWorkorderByBatch(matBatch);
					if(!StingUtil.isEmpty(batWorkOrder)){
						output = new BatWorkOrderOutput();
						order = mainList.get(i);
						output.setWorkorderpid(batWorkOrder.getPid());
						output.setMatbatch(order.getMatBatch()==null?"":order.getMatBatch().toString());
						output.setLocation(order.getLocation()==null?"":order.getLocation().toString());
						output.setLocationname(order.getLocationName()==null?"":order.getLocationName().toString());
						output.setStime2(order.getStarttime()==null?"":order.getStarttime().toString());
						output.setEtime2(order.getEndtime()==null?"":order.getEndtime().toString());
						output.setQuantity(order.getQuantity()==null?0.0:Double.parseDouble(order.getQuantity().toString()));
						output.setUnit(order.getUnit()==null?"":order.getUnit().toString());
						output.setDepot(Constants.DEPOT);
						output.setOperateuserid(this.getUserIdByUserCode(order.getOperateUsercode()));
						output.setRemark(order.getRemark()==null?"":order.getRemark().toString());
						output.setSysflag(Constants.SYS_FLAG_USEING);
						output.setCreator(Constants.USERID);
						output.setCreatetime(DateBean.getSysdateTime());
						genericDao.save(output);
						//转储完数据后更新转储状态
						UBatTransToBaccoInCabinet main1 = (UBatTransToBaccoInCabinet)genericDao.getById(UBatTransToBaccoInCabinet.class,mainList.get(i).getPid());
						main1.setSynchroFlag(Constants.SYN_CHRO_USED);
						main1.setSynchroTime(DateBean.getSysdateTime());
						genericDao.save(main1);
					}
				}
			}
		}catch(Exception e){
			e.printStackTrace();
			throw new RuntimeException();
		}
	}
}
